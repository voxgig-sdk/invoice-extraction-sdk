# InvoiceExtraction SDK feature factory

from invoiceextraction_sdk.feature.base_feature import InvoiceExtractionBaseFeature
from invoiceextraction_sdk.feature.ratelimit_feature import InvoiceExtractionRatelimitFeature
from invoiceextraction_sdk.feature.retry_feature import InvoiceExtractionRetryFeature
from invoiceextraction_sdk.feature.test_feature import InvoiceExtractionTestFeature
from invoiceextraction_sdk.feature.timeout_feature import InvoiceExtractionTimeoutFeature


_FEATURES = {
    "base": lambda: InvoiceExtractionBaseFeature(),
    "ratelimit": lambda: InvoiceExtractionRatelimitFeature(),
    "retry": lambda: InvoiceExtractionRetryFeature(),
    "test": lambda: InvoiceExtractionTestFeature(),
    "timeout": lambda: InvoiceExtractionTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
