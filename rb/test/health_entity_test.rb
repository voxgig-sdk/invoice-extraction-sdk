# Health entity test

require "minitest/autorun"
require "json"
require_relative "../InvoiceExtraction_sdk"
require_relative "runner"

class HealthEntityTest < Minitest::Test
  def test_create_instance
    testsdk = InvoiceExtractionSDK.test(nil, nil)
    ent = testsdk.Health(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = health_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "health." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set INVOICE_EXTRACTION_TEST_HEALTH_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    health_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.health")))
    health_ref01_data = nil
    if health_ref01_data_raw.length > 0
      health_ref01_data = Helpers.to_map(health_ref01_data_raw[0][1])
    end

    # LOAD
    health_ref01_ent = client.Health(nil)
    health_ref01_match_dt0 = {}
    health_ref01_data_dt0_loaded = health_ref01_ent.load(health_ref01_match_dt0, nil)
    assert !health_ref01_data_dt0_loaded.nil?

  end
end

def health_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "health", "HealthTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = InvoiceExtractionSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["health01", "health02", "health03"],
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
  entid_env_raw = ENV["INVOICE_EXTRACTION_TEST_HEALTH_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "INVOICE_EXTRACTION_TEST_HEALTH_ENTID" => idmap,
    "INVOICE_EXTRACTION_TEST_LIVE" => "FALSE",
    "INVOICE_EXTRACTION_TEST_EXPLAIN" => "FALSE",
    "INVOICE_EXTRACTION_APIKEY" => "NONE",
  })

  idmap_resolved = Helpers.to_map(
    env["INVOICE_EXTRACTION_TEST_HEALTH_ENTID"])
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
