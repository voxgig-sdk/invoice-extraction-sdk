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

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const invoice_extractionEntityLiveStrict = true


func TestInvoiceExtractionEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.InvoiceExtraction(nil)
		if ent == nil {
			t.Fatal("expected non-nil InvoiceExtractionEntity")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.InvoiceExtraction(nil).Create(map[string]any{"file_base64": 1, "media_type": "x"}, nil)
		if sdkerr, ok := err.(*core.InvoiceExtractionError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
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
		client := setup.client
		_ = client

		// CREATE
		invoiceExtractionRef01Ent := client.InvoiceExtraction(nil)
		invoiceExtractionRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "invoice_extraction"}), "invoice_extraction_ref01"))

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
	idmap, _ := vs.Transform(
		[]any{"invoice_extraction01", "invoice_extraction02", "invoice_extraction03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID": idmap,
		"INVOICE_EXTRACTION_TEST_LIVE":      "FALSE",
		"INVOICE_EXTRACTION_TEST_EXPLAIN":   "FALSE",
		"INVOICE_EXTRACTION_APIKEY":         "",
	})

	idmapResolved := core.ToMapAny(env["INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["INVOICE_EXTRACTION_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
				"apikey": env["INVOICE_EXTRACTION_APIKEY"],
			},
			extraOpts,
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
