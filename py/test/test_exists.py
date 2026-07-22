# ProjectName SDK exists test

import pytest
from invoiceextraction_sdk import InvoiceExtractionSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = InvoiceExtractionSDK.test(None, None)
        assert testsdk is not None
