# InvoiceExtraction SDK feature factory

from invoiceextraction_sdk.feature.base_feature import InvoiceExtractionBaseFeature
from invoiceextraction_sdk.feature.test_feature import InvoiceExtractionTestFeature


def _make_feature(name):
    features = {
        "base": lambda: InvoiceExtractionBaseFeature(),
        "test": lambda: InvoiceExtractionTestFeature(),
    }
    factory = features.get(name)
    if factory is not None:
        return factory()
    return features["base"]()
