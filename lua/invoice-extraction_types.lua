-- Typed models for the InvoiceExtraction SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Health
---@field status? string
---@field timestamp? string

---@class HealthLoadMatch
---@field status? string
---@field timestamp? string

---@class InvoiceExtraction
---@field amounts? table
---@field confidence? number
---@field document? table
---@field file_base64 string
---@field issuer? table
---@field items? table
---@field media_type string
---@field receiver? table

---@class InvoiceExtractionCreateData
---@field amounts? table
---@field confidence? number
---@field document? table
---@field file_base64 string
---@field issuer? table
---@field items? table
---@field media_type string
---@field receiver? table

local M = {}

return M
