# InvoiceExtraction SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "InvoiceExtraction",
            "slug": "invoice-extraction",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
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
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://invoiceextract-api-production.up.railway.app",
            "auth": {
                "prefix": "",
                "name": "x-api-key",
            },
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "health": {},
                "invoice_extraction": {},
            },
        },
        "entity": {
      "health": {
        "fields": [
          {
            "name": "status",
            "title": "Status",
            "type": "`$STRING`",
          },
          {
            "name": "timestamp",
            "title": "Timestamp",
            "type": "`$STRING`",
            "format": "date-time",
          },
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
                    "lit": "health",
                  },
                ],
                "parts": [
                  "health",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {},
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "invoice_extraction": {
        "fields": [
          {
            "name": "amounts",
            "title": "Amounts",
            "type": "`$OBJECT`",
            "short": "Financial amounts from the invoice",
          },
          {
            "name": "confidence",
            "title": "Confidence",
            "type": "`$NUMBER`",
            "short": "Confidence score of the extraction (0 to 1)",
            "format": "float",
          },
          {
            "name": "document",
            "title": "Document",
            "type": "`$OBJECT`",
            "short": "Document metadata",
          },
          {
            "name": "file_base64",
            "title": "File Base64",
            "type": "`$STRING`",
            "req": True,
            "short": "Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)",
          },
          {
            "name": "issuer",
            "title": "Issuer",
            "type": "`$OBJECT`",
            "short": "Information about the invoice issuer/vendor",
          },
          {
            "name": "items",
            "title": "Items",
            "type": "`$ARRAY`",
            "short": "Line items from the invoice",
          },
          {
            "name": "media_type",
            "title": "Media Type",
            "type": "`$STRING`",
            "req": True,
            "short": "MIME type of the submitted file",
          },
          {
            "name": "receiver",
            "title": "Receiver",
            "type": "`$OBJECT`",
            "short": "Information about the invoice receiver/customer",
          },
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
                    "lit": "extract",
                  },
                ],
                "parts": [
                  "extract",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
                "args": {},
                "select": {},
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
