# frozen_string_literal: true

# Typed models for the InvoiceExtraction SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Health entity data model.
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] timestamp
#   @return [String, nil]
Health = Struct.new(
  :status,
  :timestamp,
  keyword_init: true
)

# Request payload for Health#load.
#
# @!attribute [rw] status
#   @return [String, nil]
#
# @!attribute [rw] timestamp
#   @return [String, nil]
HealthLoadMatch = Struct.new(
  :status,
  :timestamp,
  keyword_init: true
)

# InvoiceExtraction entity data model.
#
# @!attribute [rw] data
#   @return [Hash, nil]
#
# @!attribute [rw] file_base64
#   @return [String]
#
# @!attribute [rw] media_type
#   @return [String]
#
# @!attribute [rw] success
#   @return [Boolean, nil]
InvoiceExtraction = Struct.new(
  :data,
  :file_base64,
  :media_type,
  :success,
  keyword_init: true
)

# Request payload for InvoiceExtraction#create.
#
# @!attribute [rw] data
#   @return [Hash, nil]
#
# @!attribute [rw] file_base64
#   @return [String]
#
# @!attribute [rw] media_type
#   @return [String]
#
# @!attribute [rw] success
#   @return [Boolean, nil]
InvoiceExtractionCreateData = Struct.new(
  :data,
  :file_base64,
  :media_type,
  :success,
  keyword_init: true
)

