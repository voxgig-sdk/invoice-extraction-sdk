-- InvoiceExtraction SDK exists test

local sdk = require("invoice-extraction_sdk")

describe("InvoiceExtractionSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
