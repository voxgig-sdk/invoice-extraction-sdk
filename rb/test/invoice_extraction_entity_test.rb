# InvoiceExtraction entity test

require "minitest/autorun"
require "json"
require_relative "../InvoiceExtraction_sdk"
require_relative "runner"

class InvoiceExtractionEntityTest < Minitest::Test
  def test_create_instance
    testsdk = InvoiceExtractionSDK.test(nil, nil)
    ent = testsdk.InvoiceExtraction(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = invoice_extraction_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "invoice_extraction." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    invoice_extraction_ref01_ent = client.InvoiceExtraction(nil)
    invoice_extraction_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.invoice_extraction"), "invoice_extraction_ref01"))

    invoice_extraction_ref01_data_result = invoice_extraction_ref01_ent.create(invoice_extraction_ref01_data, nil)
    invoice_extraction_ref01_data = Helpers.to_map(invoice_extraction_ref01_data_result.respond_to?(:data_get) ? invoice_extraction_ref01_data_result.data_get : invoice_extraction_ref01_data_result)
    assert !invoice_extraction_ref01_data.nil?

  end
end

def invoice_extraction_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "invoice_extraction", "InvoiceExtractionTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = InvoiceExtractionSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["invoice_extraction01", "invoice_extraction02", "invoice_extraction03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID" => idmap,
    "INVOICE_EXTRACTION_TEST_LIVE" => "FALSE",
    "INVOICE_EXTRACTION_TEST_EXPLAIN" => "FALSE",
    "INVOICE_EXTRACTION_APIKEY" => "NONE",
  })

  idmap_resolved = Helpers.to_map(
    env["INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["INVOICE_EXTRACTION_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      {
        "apikey" => env["INVOICE_EXTRACTION_APIKEY"],
      },
      extra || {},
    ])
    client = InvoiceExtractionSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["INVOICE_EXTRACTION_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["INVOICE_EXTRACTION_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
