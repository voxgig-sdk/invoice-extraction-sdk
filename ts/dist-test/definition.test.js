"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "health",
        "accessor": "Health",
        "op": "load",
        "method": "GET",
        "path": "/health",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [],
        "status": 200,
        "sample": {
            "status": "healthy",
            "timestamp": "2024-11-15T10:30:00Z"
        },
        "idField": "id"
    },
    {
        "entity": "invoice_extraction",
        "accessor": "InvoiceExtraction",
        "op": "create",
        "method": "POST",
        "path": "/extract",
        "args": [],
        "select": {},
        "headers": [],
        "cookies": [],
        "responseMedia": [
            "application/json"
        ],
        "query": [],
        "queryArgs": [],
        "auth": [
            [
                {
                    "in": "header",
                    "name": "x-api-key"
                }
            ]
        ],
        "status": 200,
        "sample": {
            "success": true,
            "data": {
                "issuer": {
                    "name": "Papelería El Centro",
                    "tax_id": "PEC920314AB3"
                },
                "amounts": {
                    "subtotal": 4500,
                    "tax_amount": 720,
                    "total": 5220
                },
                "document": {
                    "number": "F-2024-00892",
                    "date": "2024-11-15",
                    "currency": "MXN"
                },
                "confidence": 0.97
            }
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map