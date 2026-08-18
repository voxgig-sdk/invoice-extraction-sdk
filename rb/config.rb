# InvoiceExtraction SDK configuration

module InvoiceExtractionConfig
  # Return the process-wide config, built once on first use. The SDK reads
  # the config on every request and never writes to it, so one instance is
  # shared by every client rather than rebuilt per client.
  #
  # The returned hash is shared: treat it as read-only. Callers that need to
  # mutate should use make_config, which always returns a fresh copy.
  def self.shared_config
    @shared_config ||= make_config
  end


  # Build a fresh, fully materialised config hash. Every call rebuilds the
  # whole structure, so prefer shared_config unless you need a private copy
  # you intend to mutate.
  def self.make_config
    {
      "main" => {
        "name" => "InvoiceExtraction",
      },
      "feature" => {
        "test" => {
          "options" => {
            "active" => false,
          },
        },
      },
      "options" => {
        "base" => "https://invoiceextract-api-production.up.railway.app",
        "auth" => {
          "prefix" => "",
        },
        "headers" => {
          "content-type" => "application/json",
        },
        "entity" => {
          "health" => {},
          "invoice_extraction" => {},
        },
      },
      "entity" => {
        "health" => {
          "fields" => [
            {
              "name" => "status",
              "type" => "`$STRING`",
            },
            {
              "name" => "timestamp",
              "type" => "`$STRING`",
            },
          ],
          "name" => "health",
          "op" => {
            "load" => {
              "input" => "data",
              "name" => "load",
              "points" => [
                {
                  "args" => {},
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/health",
                  "parts" => [
                    "health",
                  ],
                  "select" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "invoice_extraction" => {
          "fields" => [
            {
              "name" => "amounts",
              "type" => "`$OBJECT`",
            },
            {
              "name" => "confidence",
              "type" => "`$NUMBER`",
            },
            {
              "name" => "document",
              "type" => "`$OBJECT`",
            },
            {
              "name" => "file_base64",
              "req" => true,
              "type" => "`$STRING`",
            },
            {
              "name" => "issuer",
              "type" => "`$OBJECT`",
            },
            {
              "name" => "items",
              "type" => "`$ARRAY`",
            },
            {
              "name" => "media_type",
              "req" => true,
              "type" => "`$STRING`",
            },
            {
              "name" => "receiver",
              "type" => "`$OBJECT`",
            },
          ],
          "name" => "invoice_extraction",
          "op" => {
            "create" => {
              "input" => "data",
              "name" => "create",
              "points" => [
                {
                  "args" => {},
                  "kind" => "http",
                  "method" => "POST",
                  "orig" => "/extract",
                  "parts" => [
                    "extract",
                  ],
                  "select" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.data`",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
      },
    }
  end


  def self.make_feature(name)
    require_relative 'features'
    InvoiceExtractionFeatures.make_feature(name)
  end
end
