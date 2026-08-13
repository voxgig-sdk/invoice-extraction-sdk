# InvoiceExtraction entity test

import json
import os
import time

import pytest

from invoiceextraction_sdk.utility.voxgig_struct import voxgig_struct as vs
from invoiceextraction_sdk import InvoiceExtractionSDK
from invoiceextraction_sdk.core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestInvoiceExtractionEntity:

    def test_should_create_instance(self):
        testsdk = InvoiceExtractionSDK.test(None, None)
        ent = testsdk.InvoiceExtraction(None)
        assert ent is not None

    def test_should_run_basic_flow(self):
        setup = _invoice_extraction_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "invoice_extraction." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        invoice_extraction_ref01_ent = client.InvoiceExtraction(None)
        invoice_extraction_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.invoice_extraction"), "invoice_extraction_ref01"))

        invoice_extraction_ref01_data = helpers.to_map(runner.entity_data(invoice_extraction_ref01_ent.create(invoice_extraction_ref01_data, None)))
        assert invoice_extraction_ref01_data is not None



def _invoice_extraction_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/invoice_extraction/InvoiceExtractionTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = InvoiceExtractionSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["invoice_extraction01", "invoice_extraction02", "invoice_extraction03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Detect ENTID env override before envOverride consumes it. When live
    # mode is on without a real override, the basic test runs against synthetic
    # IDs from the fixture and 4xx's. We surface this so the test can skip.
    _entid_env_raw = os.environ.get(
        "INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID": idmap,
        "INVOICE_EXTRACTION_TEST_LIVE": "FALSE",
        "INVOICE_EXTRACTION_TEST_EXPLAIN": "FALSE",
        "INVOICE_EXTRACTION_APIKEY": "NONE",
    })

    idmap_resolved = helpers.to_map(
        env.get("INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("INVOICE_EXTRACTION_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            {
                "apikey": env.get("INVOICE_EXTRACTION_APIKEY"),
            },
            extra or {},
        ])
        client = InvoiceExtractionSDK(helpers.to_map(merged_opts))

    _live = env.get("INVOICE_EXTRACTION_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("INVOICE_EXTRACTION_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
