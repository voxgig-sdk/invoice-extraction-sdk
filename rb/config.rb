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
        "slug" => "invoice-extraction",
        "version" => "0.0.1",
        "target" => "rb",
      },
      "feature" => {
        "test" => {
          "options" => {
            "active" => false,
          },
          "transport" => "base",
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
              "format" => "date-time",
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
                  "segments" => [
                    {
                      "lit" => "health",
                    },
                  ],
                  "select" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                  "parts" => [
                    "health",
                  ],
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
              "short" => "Financial amounts from the invoice",
              "type" => "`$OBJECT`",
            },
            {
              "format" => "float",
              "name" => "confidence",
              "short" => "Confidence score of the extraction (0 to 1)",
              "type" => "`$NUMBER`",
            },
            {
              "name" => "document",
              "short" => "Document metadata",
              "type" => "`$OBJECT`",
            },
            {
              "name" => "file_base64",
              "req" => true,
              "short" => "Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)",
              "type" => "`$STRING`",
            },
            {
              "name" => "issuer",
              "short" => "Information about the invoice issuer/vendor",
              "type" => "`$OBJECT`",
            },
            {
              "name" => "items",
              "short" => "Line items from the invoice",
              "type" => "`$ARRAY`",
            },
            {
              "name" => "media_type",
              "req" => true,
              "short" => "MIME type of the submitted file",
              "type" => "`$STRING`",
            },
            {
              "name" => "receiver",
              "short" => "Information about the invoice receiver/customer",
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
                  "segments" => [
                    {
                      "lit" => "extract",
                    },
                  ],
                  "select" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.data`",
                  },
                  "parts" => [
                    "extract",
                  ],
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
