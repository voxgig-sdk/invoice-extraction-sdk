<?php
declare(strict_types=1);

// InvoiceExtraction SDK utility: result_headers

class InvoiceExtractionResultHeaders
{
    public static function call(InvoiceExtractionContext $ctx): ?InvoiceExtractionResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
