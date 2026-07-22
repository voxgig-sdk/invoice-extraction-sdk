<?php
declare(strict_types=1);

// InvoiceExtraction SDK exists test

require_once __DIR__ . '/../invoiceextraction_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = InvoiceExtractionSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
