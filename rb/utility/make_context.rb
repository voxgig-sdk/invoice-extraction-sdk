# InvoiceExtraction SDK utility: make_context
require_relative '../core/context'
module InvoiceExtractionUtilities
  MakeContext = ->(ctxmap, basectx) {
    InvoiceExtractionContext.new(ctxmap, basectx)
  }
end
