<?php
declare(strict_types=1);

// InvoiceExtraction SDK utility: prepare_path

class InvoiceExtractionPreparePath
{
    public static function call(InvoiceExtractionContext $ctx): string
    {
        $point = $ctx->point;
        $parts = [];
        if ($point) {
            $p = \Voxgig\Struct\Struct::getprop($point, 'parts');
            if (is_array($p)) {
                $parts = $p;
            }
        }
        return \Voxgig\Struct\Struct::join($parts, '/', true);
    }
}
