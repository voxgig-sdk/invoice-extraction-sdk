-- InvoiceExtraction SDK error

local json = require("dkjson")

local InvoiceExtractionError = {}
InvoiceExtractionError.__index = InvoiceExtractionError

-- Reachable for a debugger, absent from the table itself: the context holds
-- the live spec and options, and an error is what gets dumped or encoded.
local CONTEXT = setmetatable({}, { __mode = "k" })


function InvoiceExtractionError.new(code, msg, ctx)
  local self = setmetatable({}, InvoiceExtractionError)
  self.is_sdk_error = true
  self.sdk = "InvoiceExtraction"
  self.code = code or ""
  self.msg = msg or ""
  self.result = nil
  self.spec = nil
  CONTEXT[self] = ctx
  return self
end


function InvoiceExtractionError:context()
  return CONTEXT[self]
end


function InvoiceExtractionError:error()
  return self.msg
end


-- What make_error attached is already cleaned; the context is not part of
-- the record.
function InvoiceExtractionError:to_table()
  return {
    sdk = self.sdk,
    code = self.code,
    msg = self.msg,
    status = self.status,
    result = self.result,
    spec = self.spec,
  }
end


function InvoiceExtractionError:to_json()
  return json.encode(self:to_table())
end


function InvoiceExtractionError:__tostring()
  return self.msg
end


function InvoiceExtractionError.__tojson(self)
  return self:to_json()
end


return InvoiceExtractionError
