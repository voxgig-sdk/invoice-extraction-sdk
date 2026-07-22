# InvoiceExtraction SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

InvoiceExtractionUtility.registrar = ->(u) {
  u.clean = InvoiceExtractionUtilities::Clean
  u.done = InvoiceExtractionUtilities::Done
  u.make_error = InvoiceExtractionUtilities::MakeError
  u.feature_add = InvoiceExtractionUtilities::FeatureAdd
  u.feature_hook = InvoiceExtractionUtilities::FeatureHook
  u.feature_init = InvoiceExtractionUtilities::FeatureInit
  u.fetcher = InvoiceExtractionUtilities::Fetcher
  u.make_fetch_def = InvoiceExtractionUtilities::MakeFetchDef
  u.make_context = InvoiceExtractionUtilities::MakeContext
  u.make_options = InvoiceExtractionUtilities::MakeOptions
  u.make_request = InvoiceExtractionUtilities::MakeRequest
  u.make_response = InvoiceExtractionUtilities::MakeResponse
  u.make_result = InvoiceExtractionUtilities::MakeResult
  u.make_point = InvoiceExtractionUtilities::MakePoint
  u.make_spec = InvoiceExtractionUtilities::MakeSpec
  u.make_url = InvoiceExtractionUtilities::MakeUrl
  u.param = InvoiceExtractionUtilities::Param
  u.prepare_auth = InvoiceExtractionUtilities::PrepareAuth
  u.prepare_body = InvoiceExtractionUtilities::PrepareBody
  u.prepare_headers = InvoiceExtractionUtilities::PrepareHeaders
  u.prepare_method = InvoiceExtractionUtilities::PrepareMethod
  u.prepare_params = InvoiceExtractionUtilities::PrepareParams
  u.prepare_path = InvoiceExtractionUtilities::PreparePath
  u.prepare_query = InvoiceExtractionUtilities::PrepareQuery
  u.result_basic = InvoiceExtractionUtilities::ResultBasic
  u.result_body = InvoiceExtractionUtilities::ResultBody
  u.result_headers = InvoiceExtractionUtilities::ResultHeaders
  u.transform_request = InvoiceExtractionUtilities::TransformRequest
  u.transform_response = InvoiceExtractionUtilities::TransformResponse
}
