package voxgiginvoiceextractionsdk

import (
	"github.com/voxgig-sdk/invoice-extraction-sdk/go/core"
	"github.com/voxgig-sdk/invoice-extraction-sdk/go/entity"
	"github.com/voxgig-sdk/invoice-extraction-sdk/go/feature"
	_ "github.com/voxgig-sdk/invoice-extraction-sdk/go/utility"
)

// Type aliases preserve external API.
type InvoiceExtractionSDK = core.InvoiceExtractionSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type InvoiceExtractionEntity = core.InvoiceExtractionEntity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type InvoiceExtractionError = core.InvoiceExtractionError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewHealthEntityFunc = func(client *core.InvoiceExtractionSDK, entopts map[string]any) core.InvoiceExtractionEntity {
		return entity.NewHealthEntity(client, entopts)
	}
	core.NewInvoiceExtractionEntityFunc = func(client *core.InvoiceExtractionSDK, entopts map[string]any) core.InvoiceExtractionEntity {
		return entity.NewInvoiceExtractionEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewInvoiceExtractionSDK = core.NewInvoiceExtractionSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewInvoiceExtractionSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *InvoiceExtractionSDK  { return NewInvoiceExtractionSDK(nil) }
func Test() *InvoiceExtractionSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
