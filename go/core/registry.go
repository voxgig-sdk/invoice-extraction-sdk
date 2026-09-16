package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewRatelimitFeatureFunc func() Feature

var NewRetryFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTimeoutFeatureFunc func() Feature

var NewHealthEntityFunc func(client *InvoiceExtractionSDK, entopts map[string]any) InvoiceExtractionEntity

var NewInvoiceExtractionEntityFunc func(client *InvoiceExtractionSDK, entopts map[string]any) InvoiceExtractionEntity

