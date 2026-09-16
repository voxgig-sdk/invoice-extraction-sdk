<?php
declare(strict_types=1);

// InvoiceExtraction SDK configuration

class InvoiceExtractionConfig
{
    /** @var array<string,mixed>|null */
    private static ?array $shared_config = null;

    /**
     * Return the process-wide config, built once on first use. The SDK reads
     * the config on every request and never writes to it, so one instance is
     * shared by every client rather than rebuilt per client.
     *
     * PHP arrays are copy-on-write, so callers that do mutate the result get
     * their own copy and cannot disturb the shared one.
     */
    public static function shared_config(): array
    {
        if (self::$shared_config === null) {
            self::$shared_config = self::make_config();
        }
        return self::$shared_config;
    }

    /**
     * Build a fresh, fully materialised config array. Every call rebuilds the
     * whole structure, so prefer shared_config unless you need a private copy.
     */
    public static function make_config(): array
    {
        return [
            "main" => [
                "name" => "InvoiceExtraction",
                "slug" => "invoice-extraction",
                "version" => "0.0.1",
                "target" => "php",
            ],
            "feature" => [
                "ratelimit" => [
          'options' => [
            'active' => false,
            'burst' => 5,
            'rate' => 5,
          ],
          'optspec' => [
            'now' => '`$FUNCTION`',
            'sleep' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
                "retry" => [
          'options' => [
            'active' => false,
            'factor' => 2,
            'maxDelay' => 2000,
            'minDelay' => 50,
            'retries' => 2,
            'statuses' => [
              408,
              425,
              429,
              500,
              502,
              503,
              504,
            ],
          ],
          'optspec' => [
            'jitter' => '`$BOOLEAN`',
            'sleep' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
                "test" => [
          'options' => [
            'active' => false,
          ],
          'optspec' => [
            'entity' => '`$MAP`',
            'net' => '`$MAP`',
          ],
          'strict' => false,
          'transport' => 'base',
        ],
                "timeout" => [
          'options' => [
            'active' => false,
            'ms' => 30000,
          ],
          'optspec' => [
            'clearTimer' => '`$FUNCTION`',
            'setTimer' => '`$FUNCTION`',
          ],
          'strict' => false,
          'transport' => 'wrap',
        ],
            ],
            "options" => [
                "base" => "https://invoiceextract-api-production.up.railway.app",
                "auth" => [
                    "prefix" => "",
                ],
                "headers" => [
          'content-type' => 'application/json',
        ],
                "entity" => [
                    "health" => [],
                    "invoice_extraction" => [],
                ],
            ],
            "entity" => [
        'health' => [
          'fields' => [
            [
              'name' => 'status',
              'type' => '`$STRING`',
            ],
            [
              'format' => 'date-time',
              'name' => 'timestamp',
              'type' => '`$STRING`',
            ],
          ],
          'name' => 'health',
          'op' => [
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/health',
                  'segments' => [
                    [
                      'lit' => 'health',
                    ],
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                  'parts' => [
                    'health',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'invoice_extraction' => [
          'fields' => [
            [
              'name' => 'amounts',
              'short' => 'Financial amounts from the invoice',
              'type' => '`$OBJECT`',
            ],
            [
              'format' => 'float',
              'name' => 'confidence',
              'short' => 'Confidence score of the extraction (0 to 1)',
              'type' => '`$NUMBER`',
            ],
            [
              'name' => 'document',
              'short' => 'Document metadata',
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'file_base64',
              'req' => true,
              'short' => 'Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'issuer',
              'short' => 'Information about the invoice issuer/vendor',
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'items',
              'short' => 'Line items from the invoice',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'media_type',
              'req' => true,
              'short' => 'MIME type of the submitted file',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'receiver',
              'short' => 'Information about the invoice receiver/customer',
              'type' => '`$OBJECT`',
            ],
          ],
          'name' => 'invoice_extraction',
          'op' => [
            'create' => [
              'input' => 'data',
              'name' => 'create',
              'points' => [
                [
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/extract',
                  'segments' => [
                    [
                      'lit' => 'extract',
                    ],
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
                  ],
                  'parts' => [
                    'extract',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
      ],
        ];
    }


    public static function make_feature(string $name)
    {
        require_once __DIR__ . '/features.php';
        return InvoiceExtractionFeatures::make_feature($name);
    }
}
