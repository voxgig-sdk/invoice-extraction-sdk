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
            ],
            "feature" => [
                "test" => [
          'options' => [
            'active' => false,
          ],
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
                  'parts' => [
                    'health',
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
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
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'confidence',
              'type' => '`$NUMBER`',
            ],
            [
              'name' => 'document',
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'file_base64',
              'req' => true,
              'type' => '`$STRING`',
            ],
            [
              'name' => 'issuer',
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'items',
              'type' => '`$ARRAY`',
            ],
            [
              'name' => 'media_type',
              'req' => true,
              'type' => '`$STRING`',
            ],
            [
              'name' => 'receiver',
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
                  'parts' => [
                    'extract',
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body.data`',
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
