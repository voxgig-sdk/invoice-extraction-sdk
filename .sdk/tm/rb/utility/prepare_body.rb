# InvoiceExtraction SDK utility: prepare_body
require_relative 'media'
module InvoiceExtractionUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return InvoiceExtractionUtilities.raw_body(ctx.reqdata) if InvoiceExtractionUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
