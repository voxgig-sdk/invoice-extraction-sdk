-- InvoiceExtraction SDK error

local InvoiceExtractionError = {}
InvoiceExtractionError.__index = InvoiceExtractionError


function InvoiceExtractionError.new(code, msg, ctx)
  local self = setmetatable({}, InvoiceExtractionError)
  self.is_sdk_error = true
  self.sdk = "InvoiceExtraction"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function InvoiceExtractionError:error()
  return self.msg
end


function InvoiceExtractionError:__tostring()
  return self.msg
end


return InvoiceExtractionError
