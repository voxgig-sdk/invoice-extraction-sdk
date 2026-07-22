<?php
declare(strict_types=1);

// InvoiceExtraction SDK utility: result_body

class InvoiceExtractionResultBody
{
    public static function call(InvoiceExtractionContext $ctx): ?InvoiceExtractionResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
