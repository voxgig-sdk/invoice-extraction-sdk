
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }


  main = {
    name: 'InvoiceExtraction',
  }


  feature = {
     test:     {
      "options": {
        "active": false
      }
    },

  }


  options = {
    base: "https://invoiceextract-api-production.up.railway.app",

    auth: {
      prefix: '',
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
          "type": "`$STRING`"
        },
        {
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
              "parts": [
                "health"
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              }
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
          "type": "`$OBJECT`"
        },
        {
          "name": "confidence",
          "type": "`$NUMBER`"
        },
        {
          "name": "document",
          "type": "`$OBJECT`"
        },
        {
          "name": "file_base64",
          "req": true,
          "type": "`$STRING`"
        },
        {
          "name": "issuer",
          "type": "`$OBJECT`"
        },
        {
          "name": "items",
          "type": "`$ARRAY`"
        },
        {
          "name": "media_type",
          "req": true,
          "type": "`$STRING`"
        },
        {
          "name": "receiver",
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
              "parts": [
                "extract"
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.data`"
              }
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
  config
}

