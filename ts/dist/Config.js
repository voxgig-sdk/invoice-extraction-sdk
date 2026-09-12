"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const TestFeature_1 = require("./feature/test/TestFeature");
const FEATURE_CLASS = {
    test: TestFeature_1.TestFeature,
};
// Per-feature plugin DEFINITIONS (voxgig/plugin `Definition` values), from
// the model's active plugin groups. A feature that takes a `plugins` option
// (secrets over sekreto) reads its own entry; a feature with no plugins has
// none. Named imports above make each definition statically reachable, so
// an SDK carries exactly the plugin modules its model selects — the same
// leanness the old side-effect registry imports bought, without a registry.
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        // TODO: errors etc
        return fi;
    }
    // False for a feature added at runtime via options.extend (station's
    // adopt path) - the constructor uses this to skip makeFeature for names
    // no generated class backs.
    hasFeature(fn) {
        return null != FEATURE_CLASS[fn];
    }
    main = {
        name: 'InvoiceExtraction',
        slug: "invoice-extraction",
        version: "0.0.1",
        target: "ts",
    };
    feature = {
        test: {
            "options": {
                "active": false
            },
            "transport": "base"
        },
    };
    options = {
        base: "https://invoiceextract-api-production.up.railway.app",
        auth: {
            prefix: '',
        },
        headers: {
            "content-type": "application/json"
        },
        entity: {
            health: {},
            invoice_extraction: {},
        }
    };
    entity = {
        "health": {
            "fields": [
                {
                    "name": "status",
                    "type": "`$STRING`"
                },
                {
                    "format": "date-time",
                    "name": "timestamp",
                    "type": "`$STRING`"
                }
            ],
            "name": "health",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "args": {},
                            "kind": "http",
                            "method": "GET",
                            "orig": "/health",
                            "segments": [
                                {
                                    "lit": "health"
                                }
                            ],
                            "select": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "health"
                            ]
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "invoice_extraction": {
            "fields": [
                {
                    "name": "amounts",
                    "short": "Financial amounts from the invoice",
                    "type": "`$OBJECT`"
                },
                {
                    "format": "float",
                    "name": "confidence",
                    "short": "Confidence score of the extraction (0 to 1)",
                    "type": "`$NUMBER`"
                },
                {
                    "name": "document",
                    "short": "Document metadata",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "file_base64",
                    "req": true,
                    "short": "Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)",
                    "type": "`$STRING`"
                },
                {
                    "name": "issuer",
                    "short": "Information about the invoice issuer/vendor",
                    "type": "`$OBJECT`"
                },
                {
                    "name": "items",
                    "short": "Line items from the invoice",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "media_type",
                    "req": true,
                    "short": "MIME type of the submitted file",
                    "type": "`$STRING`"
                },
                {
                    "name": "receiver",
                    "short": "Information about the invoice receiver/customer",
                    "type": "`$OBJECT`"
                }
            ],
            "name": "invoice_extraction",
            "op": {
                "create": {
                    "input": "data",
                    "name": "create",
                    "points": [
                        {
                            "args": {},
                            "kind": "http",
                            "method": "POST",
                            "orig": "/extract",
                            "segments": [
                                {
                                    "lit": "extract"
                                }
                            ],
                            "select": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.data`"
                            },
                            "parts": [
                                "extract"
                            ]
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        }
    };
}
const config = new Config();
exports.config = config;
//# sourceMappingURL=Config.js.map