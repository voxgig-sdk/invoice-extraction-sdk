# InvoiceExtraction SDK utility: make_context

from core.context import InvoiceExtractionContext


def make_context_util(ctxmap, basectx):
    return InvoiceExtractionContext(ctxmap, basectx)
