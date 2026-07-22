<?php
declare(strict_types=1);

// InvoiceExtraction SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';


class InvoiceExtractionFeatures
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new InvoiceExtractionBaseFeature();
            case "test":
                return new InvoiceExtractionTestFeature();
            default:
                return new InvoiceExtractionBaseFeature();
        }
    }
}
