<?php
declare(strict_types=1);

// Typed models for the InvoiceExtraction SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Health entity data model. */
class Health
{
    public ?string $status = null;
    public ?string $timestamp = null;
}

/** Request payload for Health#load. */
class HealthLoadMatch
{
    public ?string $status = null;
    public ?string $timestamp = null;
}

/** InvoiceExtraction entity data model. */
class InvoiceExtraction
{
    public ?array $data = null;
    public string $file_base64;
    public string $media_type;
    public ?bool $success = null;
}

/** Request payload for InvoiceExtraction#create. */
class InvoiceExtractionCreateData
{
    public ?array $data = null;
    public string $file_base64;
    public string $media_type;
    public ?bool $success = null;
}

