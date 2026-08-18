-- InvoiceExtraction SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "InvoiceExtraction",
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
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "confidence",
            ["type"] = "`$NUMBER`",
          },
          {
            ["name"] = "document",
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "file_base64",
            ["req"] = true,
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "issuer",
            ["type"] = "`$OBJECT`",
          },
          {
            ["name"] = "items",
            ["type"] = "`$ARRAY`",
          },
          {
            ["name"] = "media_type",
            ["req"] = true,
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "receiver",
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
