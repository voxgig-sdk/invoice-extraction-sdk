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
---@field data? table
---@field file_base64 string
---@field media_type string
---@field success? boolean

---@class InvoiceExtractionCreateData
---@field data? table
---@field file_base64 string
---@field media_type string
---@field success? boolean

local M = {}

return M
