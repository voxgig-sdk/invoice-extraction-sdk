# InvoiceExtraction SDK configuration


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
        },
        "feature": {
            "test": {
        "options": {
          "active": False,
        },
      },
        },
        "options": {
            "base": "https://invoiceextract-api-production.up.railway.app",
            "auth": {
                "prefix": "",
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
            "type": "`$STRING`",
          },
          {
            "name": "timestamp",
            "type": "`$STRING`",
          },
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
                  "health",
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
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
            "type": "`$OBJECT`",
          },
          {
            "name": "confidence",
            "type": "`$NUMBER`",
          },
          {
            "name": "document",
            "type": "`$OBJECT`",
          },
          {
            "name": "file_base64",
            "req": True,
            "type": "`$STRING`",
          },
          {
            "name": "issuer",
            "type": "`$OBJECT`",
          },
          {
            "name": "items",
            "type": "`$ARRAY`",
          },
          {
            "name": "media_type",
            "req": True,
            "type": "`$STRING`",
          },
          {
            "name": "receiver",
            "type": "`$OBJECT`",
          },
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
                  "extract",
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.data`",
                },
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
