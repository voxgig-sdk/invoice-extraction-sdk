-- InvoiceExtraction SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "InvoiceExtraction",
      slug = "invoice-extraction",
      version = "0.0.1",
      target = "lua",
    },
    feature = {
      ["test"] = {
        ["options"] = {
          ["active"] = false,
        },
      },
    },
    options = {
      base = "https://invoiceextract-api-production.up.railway.app",
      auth = {
        prefix = "",
      },
      headers = {
        ["content-type"] = "application/json",
      },
      entity = {
        ["health"] = {},
        ["invoice_extraction"] = {},
      },
    },
    entity = {
      ["health"] = {
        ["fields"] = {
          {
            ["name"] = "status",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "timestamp",
            ["type"] = "`$STRING`",
          },
        },
        ["name"] = "health",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/health",
                ["parts"] = {
                  "health",
                },
                ["select"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["invoice_extraction"] = {
        ["fields"] = {
          {
            ["name"] = "amounts",
            ["short"] = "Financial amounts from the invoice",
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "confidence",
            ["short"] = "Confidence score of the extraction (0 to 1)",
            ["type"] = "`$NUMBER`",
          },
          {
            ["name"] = "document",
            ["short"] = "Document metadata",
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "file_base64",
            ["req"] = true,
            ["short"] = "Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "issuer",
            ["short"] = "Information about the invoice issuer/vendor",
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "items",
            ["short"] = "Line items from the invoice",
            ["type"] = "`$ARRAY`",
          },
          {
            ["name"] = "media_type",
            ["req"] = true,
            ["short"] = "MIME type of the submitted file",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "receiver",
            ["short"] = "Information about the invoice receiver/customer",
            ["type"] = "`$OBJECT`",
          },
        },
        ["name"] = "invoice_extraction",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/extract",
                ["parts"] = {
                  "extract",
                },
                ["select"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.data`",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
    },
  }
end


local function make_feature(name)
  local features = require("features")
  local factory = features[name]
  if factory ~= nil then
    return factory()
  end
  return features.base()
end


-- Attach make_feature to the SDK class
local function setup_sdk(SDK)
  SDK._make_feature = make_feature
end


return make_config
