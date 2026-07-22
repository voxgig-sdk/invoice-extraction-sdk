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
  data?: Record<string, any>
  file_base64: string
  media_type: string
  success?: boolean
}

export interface InvoiceExtractionCreateData {
  data?: Record<string, any>
  file_base64: string
  media_type: string
  success?: boolean
}

