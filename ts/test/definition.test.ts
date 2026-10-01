import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "health",
    "accessor": "Health",
    "op": "load",
    "method": "GET",
    "path": "/health",
    "args": [],
    "select": {},
    "headers": [],
    "query": [],
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
    "query": [],
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
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
