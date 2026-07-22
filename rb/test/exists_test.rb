# InvoiceExtraction SDK exists test

require "minitest/autorun"
require_relative "../InvoiceExtraction_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = InvoiceExtractionSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
