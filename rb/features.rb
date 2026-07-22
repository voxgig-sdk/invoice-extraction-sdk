# InvoiceExtraction SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/test_feature'


module InvoiceExtractionFeatures
  def self.make_feature(name)
    case name
    when "base"
      InvoiceExtractionBaseFeature.new
    when "test"
      InvoiceExtractionTestFeature.new
    else
      InvoiceExtractionBaseFeature.new
    end
  end
end
