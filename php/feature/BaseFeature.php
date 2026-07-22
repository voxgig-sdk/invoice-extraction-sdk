<?php
declare(strict_types=1);

// InvoiceExtraction SDK base feature

class InvoiceExtractionBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(InvoiceExtractionContext $ctx, array $options): void {}
    public function PostConstruct(InvoiceExtractionContext $ctx): void {}
    public function PostConstructEntity(InvoiceExtractionContext $ctx): void {}
    public function SetData(InvoiceExtractionContext $ctx): void {}
    public function GetData(InvoiceExtractionContext $ctx): void {}
    public function GetMatch(InvoiceExtractionContext $ctx): void {}
    public function SetMatch(InvoiceExtractionContext $ctx): void {}
    public function PrePoint(InvoiceExtractionContext $ctx): void {}
    public function PreSpec(InvoiceExtractionContext $ctx): void {}
    public function PreRequest(InvoiceExtractionContext $ctx): void {}
    public function PreResponse(InvoiceExtractionContext $ctx): void {}
    public function PreResult(InvoiceExtractionContext $ctx): void {}
    public function PreDone(InvoiceExtractionContext $ctx): void {}
    public function PreUnexpected(InvoiceExtractionContext $ctx): void {}
}
