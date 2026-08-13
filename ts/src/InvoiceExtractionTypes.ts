// Typed models for the InvoiceExtraction SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Health {
  status?: string
  timestamp?: string
}

export interface HealthLoadMatch {
  status?: string
  timestamp?: string
}

export interface InvoiceExtraction {
  amounts?: Record<string, any>
  confidence?: number
  document?: Record<string, any>
  file_base64: string
  issuer?: Record<string, any>
  items?: any[]
  media_type: string
  receiver?: Record<string, any>
}

export interface InvoiceExtractionCreateData {
  amounts?: Record<string, any>
  confidence?: number
  document?: Record<string, any>
  file_base64: string
  issuer?: Record<string, any>
  items?: any[]
  media_type: string
  receiver?: Record<string, any>
}

