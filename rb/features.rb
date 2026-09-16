# InvoiceExtraction SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module InvoiceExtractionFeatures
  def self.make_feature(name)
    case name
    when "base"
      InvoiceExtractionBaseFeature.new
    when "ratelimit"
      InvoiceExtractionRatelimitFeature.new
    when "retry"
      InvoiceExtractionRetryFeature.new
    when "test"
      InvoiceExtractionTestFeature.new
    when "timeout"
      InvoiceExtractionTimeoutFeature.new
    else
      InvoiceExtractionBaseFeature.new
    end
  end
end
