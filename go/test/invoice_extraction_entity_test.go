package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/invoice-extraction-sdk/go"
	"github.com/voxgig-sdk/invoice-extraction-sdk/go/core"

	vs "github.com/voxgig-sdk/invoice-extraction-sdk/go/utility/struct"
)

func TestInvoiceExtractionEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.InvoiceExtraction(nil)
		if ent == nil {
			t.Fatal("expected non-nil InvoiceExtractionEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := invoice_extractionBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "invoice_extraction." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		invoiceExtractionRef01Ent := client.InvoiceExtraction(nil)
		invoiceExtractionRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "invoice_extraction"}, setup.data), "invoice_extraction_ref01"))

		invoiceExtractionRef01DataResult, err := invoiceExtractionRef01Ent.Create(invoiceExtractionRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		invoiceExtractionRef01Data = core.ToMapAny(entityData(invoiceExtractionRef01DataResult))
		if invoiceExtractionRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

	})
}

func invoice_extractionBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "invoice_extraction", "InvoiceExtractionTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read invoice_extraction test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse invoice_extraction test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"invoice_extraction01", "invoice_extraction02", "invoice_extraction03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID": idmap,
		"INVOICE_EXTRACTION_TEST_LIVE":      "FALSE",
		"INVOICE_EXTRACTION_TEST_EXPLAIN":   "FALSE",
		"INVOICE_EXTRACTION_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["INVOICE_EXTRACTION_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["INVOICE_EXTRACTION_APIKEY"],
			},
			extra,
		})
		client = sdk.NewInvoiceExtractionSDK(core.ToMapAny(mergedOpts))
	}

	live := env["INVOICE_EXTRACTION_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["INVOICE_EXTRACTION_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
