
import { BaseFeature } from './feature/base/BaseFeature'
import { RatelimitFeature } from './feature/ratelimit/RatelimitFeature'
import { RetryFeature } from './feature/retry/RetryFeature'
import { TestFeature } from './feature/test/TestFeature'
import { TimeoutFeature } from './feature/timeout/TimeoutFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   ratelimit: RatelimitFeature,
 retry: RetryFeature,
 test: TestFeature,
 timeout: TimeoutFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'InvoiceExtraction',
        slug: "invoice-extraction",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     ratelimit:     {
      "options": {
        "active": false,
        "burst": 5,
        "rate": 5
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 retry:     {
      "options": {
        "active": false,
        "factor": 2,
        "maxDelay": 2000,
        "minDelay": 50,
        "retries": 2,
        "statuses": [
          408,
          425,
          429,
          500,
          502,
          503,
          504
        ]
      },
      "optspec": {
        "jitter": "`$BOOLEAN`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },
 timeout:     {
      "options": {
        "active": false,
        "ms": 30000
      },
      "optspec": {
        "clearTimer": "`$FUNCTION`",
        "setTimer": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },

  }


  options = {
    base: "https://invoiceextract-api-production.up.railway.app",

    auth: {
      prefix: '',
      name: 'x-api-key',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        health: {
        },
  
        invoice_extraction: {
        },
  
    }
  }


  entity = {
    "health": {
      "fields": [
        {
          "name": "status",
          "title": "Status",
          "type": "`$STRING`"
        },
        {
          "name": "timestamp",
          "title": "Timestamp",
          "type": "`$STRING`",
          "format": "date-time"
        }
      ],
      "name": "health",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/health",
              "segments": [
                {
                  "lit": "health"
                }
              ],
              "parts": [
                "health"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
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
          "title": "Amounts",
          "type": "`$OBJECT`",
          "short": "Financial amounts from the invoice"
        },
        {
          "name": "confidence",
          "title": "Confidence",
          "type": "`$NUMBER`",
          "short": "Confidence score of the extraction (0 to 1)",
          "format": "float"
        },
        {
          "name": "document",
          "title": "Document",
          "type": "`$OBJECT`",
          "short": "Document metadata"
        },
        {
          "name": "file_base64",
          "title": "File Base64",
          "type": "`$STRING`",
          "req": true,
          "short": "Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)"
        },
        {
          "name": "issuer",
          "title": "Issuer",
          "type": "`$OBJECT`",
          "short": "Information about the invoice issuer/vendor"
        },
        {
          "name": "items",
          "title": "Items",
          "type": "`$ARRAY`",
          "short": "Line items from the invoice"
        },
        {
          "name": "media_type",
          "title": "Media Type",
          "type": "`$STRING`",
          "req": true,
          "short": "MIME type of the submitted file"
        },
        {
          "name": "receiver",
          "title": "Receiver",
          "type": "`$OBJECT`",
          "short": "Information about the invoice receiver/customer"
        }
      ],
      "name": "invoice_extraction",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/extract",
              "segments": [
                {
                  "lit": "extract"
                }
              ],
              "parts": [
                "extract"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

