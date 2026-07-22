# InvoiceExtraction SDK utility: prepare_body
module InvoiceExtractionUtilities
  PrepareBody = ->(ctx) {
    ctx.op.input == "data" ? ctx.utility.transform_request.call(ctx) : nil
  }
end
