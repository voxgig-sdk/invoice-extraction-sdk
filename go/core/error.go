package core

type InvoiceExtractionError struct {
	IsInvoiceExtractionError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewInvoiceExtractionError(code string, msg string, ctx *Context) *InvoiceExtractionError {
	return &InvoiceExtractionError{
		IsInvoiceExtractionError: true,
		Sdk:              "InvoiceExtraction",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *InvoiceExtractionError) Error() string {
	return e.Msg
}
