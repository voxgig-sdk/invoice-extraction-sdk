<?php
declare(strict_types=1);

// InvoiceExtraction SDK utility: prepare_body

class InvoiceExtractionPrepareBody
{
    public static function call(InvoiceExtractionContext $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
