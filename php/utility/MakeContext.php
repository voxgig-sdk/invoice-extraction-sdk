<?php
declare(strict_types=1);

// InvoiceExtraction SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class InvoiceExtractionMakeContext
{
    public static function call(array $ctxmap, ?InvoiceExtractionContext $basectx): InvoiceExtractionContext
    {
        return new InvoiceExtractionContext($ctxmap, $basectx);
    }
}
