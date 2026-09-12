package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "InvoiceExtraction",
			"slug": "invoice-extraction",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"transport": "base",
			},
		},
		"options": map[string]any{
			"base": "https://invoiceextract-api-production.up.railway.app",
			"auth": map[string]any{
				"prefix": "",
			},
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"health": map[string]any{},
				"invoice_extraction": map[string]any{},
			},
		},
		"entity": map[string]any{
			"health": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "status",
						"type": "`$STRING`",
					},
					map[string]any{
						"format": "date-time",
						"name": "timestamp",
						"type": "`$STRING`",
					},
				},
				"name": "health",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/health",
								"segments": []any{
									map[string]any{
										"lit": "health",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"parts": []any{
									"health",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"invoice_extraction": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "amounts",
						"short": "Financial amounts from the invoice",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"format": "float",
						"name": "confidence",
						"short": "Confidence score of the extraction (0 to 1)",
						"type": "`$NUMBER`",
					},
					map[string]any{
						"name": "document",
						"short": "Document metadata",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "file_base64",
						"req": true,
						"short": "Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "issuer",
						"short": "Information about the invoice issuer/vendor",
						"type": "`$OBJECT`",
					},
					map[string]any{
						"name": "items",
						"short": "Line items from the invoice",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "media_type",
						"req": true,
						"short": "MIME type of the submitted file",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "receiver",
						"short": "Information about the invoice receiver/customer",
						"type": "`$OBJECT`",
					},
				},
				"name": "invoice_extraction",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/extract",
								"segments": []any{
									map[string]any{
										"lit": "extract",
									},
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.data`",
								},
								"parts": []any{
									"extract",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
