
import { Context } from './Context'


class InvoiceExtractionError extends Error {

  isInvoiceExtractionError = true

  sdk = 'InvoiceExtraction'

  code: string
  ctx: Context

  constructor(code: string, msg: string, ctx: Context) {
    super(msg)
    this.code = code
    this.ctx = ctx
  }

}

export {
  InvoiceExtractionError
}

