

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { InvoiceExtractionSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
loadEnvLocal(__dirname + '/../../../.env.local')


describe('InvoiceExtractionEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when INVOICE_EXTRACTION_TEST_LIVE=TRUE.
  afterEach(liveDelay('INVOICE_EXTRACTION_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = InvoiceExtractionSDK.test()
    const ent = testsdk.InvoiceExtraction()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.INVOICE_EXTRACTION_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'invoice_extraction.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"amounts","req":false,"short":"Financial amounts from the invoice","type":"`$OBJECT`","index$":0},{"active":true,"format":"float","name":"confidence","req":false,"short":"Confidence score of the extraction (0 to 1)","type":"`$NUMBER`","index$":1},{"active":true,"name":"document","req":false,"short":"Document metadata","type":"`$OBJECT`","index$":2},{"active":true,"name":"file_base64","req":true,"short":"Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)","type":"`$STRING`","index$":3},{"active":true,"name":"issuer","req":false,"short":"Information about the invoice issuer/vendor","type":"`$OBJECT`","index$":4},{"active":true,"name":"items","req":false,"short":"Line items from the invoice","type":"`$ARRAY`","index$":5},{"active":true,"name":"media_type","req":true,"short":"MIME type of the submitted file","type":"`$STRING`","index$":6},{"active":true,"name":"receiver","req":false,"short":"Information about the invoice receiver/customer","type":"`$OBJECT`","index$":7}],"name":"invoice_extraction","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{},"contract":{"id":"POST /extract","json":"{\"operationId\":\"extractInvoiceData\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"examples\":{\"image_invoice\":{\"summary\":\"Image invoice example\",\"value\":{\"file_base64\":\"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBg...\",\"media_type\":\"image/jpeg\"}},\"pdf_invoice\":{\"summary\":\"PDF invoice example\",\"value\":{\"file_base64\":\"JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...\",\"media_type\":\"application/pdf\"}}},\"schema\":{\"properties\":{\"file_base64\":{\"description\":\"Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)\",\"example\":\"JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...\",\"type\":\"string\"},\"media_type\":{\"description\":\"MIME type of the submitted file\",\"enum\":[\"application/pdf\",\"image/jpeg\",\"image/jpg\",\"image/png\",\"image/webp\"],\"example\":\"application/pdf\",\"type\":\"string\"}},\"required\":[\"file_base64\",\"media_type\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"examples\":{\"successful_extraction\":{\"summary\":\"Successful invoice extraction\",\"value\":{\"data\":{\"amounts\":{\"subtotal\":4500,\"tax_amount\":720,\"total\":5220},\"confidence\":0.97,\"document\":{\"currency\":\"MXN\",\"date\":\"2024-11-15\",\"number\":\"F-2024-00892\"},\"issuer\":{\"name\":\"Papelería El Centro\",\"tax_id\":\"PEC920314AB3\"}},\"success\":true}}},\"schema\":{\"properties\":{\"data\":{\"properties\":{\"amounts\":{\"description\":\"Financial amounts from the invoice\",\"properties\":{\"discount\":{\"description\":\"Discount amount if applicable\",\"format\":\"float\",\"nullable\":true,\"type\":\"number\"},\"subtotal\":{\"description\":\"Subtotal amount before taxes\",\"example\":4500,\"format\":\"float\",\"type\":\"number\"},\"tax_amount\":{\"description\":\"Total tax amount\",\"example\":720,\"format\":\"float\",\"type\":\"number\"},\"total\":{\"description\":\"Total amount including taxes\",\"example\":5220,\"format\":\"float\",\"type\":\"number\"}},\"type\":\"object\"},\"confidence\":{\"description\":\"Confidence score of the extraction (0 to 1)\",\"example\":0.97,\"format\":\"float\",\"maximum\":1,\"minimum\":0,\"type\":\"number\"},\"document\":{\"description\":\"Document metadata\",\"properties\":{\"currency\":{\"description\":\"Currency code (ISO 4217)\",\"example\":\"MXN\",\"type\":\"string\"},\"date\":{\"description\":\"Invoice date in YYYY-MM-DD format\",\"example\":\"2024-11-15\",\"format\":\"date\",\"type\":\"string\"},\"due_date\":{\"description\":\"Due date for payment\",\"format\":\"date\",\"nullable\":true,\"type\":\"string\"},\"number\":{\"description\":\"Invoice or document number\",\"example\":\"F-2024-00892\",\"type\":\"string\"},\"type\":{\"description\":\"Type of document (invoice, receipt, etc.)\",\"nullable\":true,\"type\":\"string\"}},\"type\":\"object\"},\"issuer\":{\"description\":\"Information about the invoice issuer/vendor\",\"properties\":{\"address\":{\"description\":\"Address of the issuer\",\"nullable\":true,\"type\":\"string\"},\"email\":{\"description\":\"Email of the issuer\",\"nullable\":true,\"type\":\"string\"},\"name\":{\"description\":\"Name of the issuing company or vendor\",\"example\":\"Papelería El Centro\",\"type\":\"string\"},\"phone\":{\"description\":\"Phone number of the issuer\",\"nullable\":true,\"type\":\"string\"},\"tax_id\":{\"description\":\"Tax identification number (RFC, VAT, etc.)\",\"example\":\"PEC920314AB3\",\"type\":\"string\"}},\"type\":\"object\"},\"items\":{\"description\":\"Line items from the invoice\",\"items\":{\"properties\":{\"amount\":{\"description\":\"Total amount for this line item\",\"format\":\"float\",\"type\":\"number\"},\"description\":{\"description\":\"Item description\",\"type\":\"string\"},\"quantity\":{\"description\":\"Quantity of the item\",\"type\":\"number\"},\"tax_rate\":{\"description\":\"Tax rate applied to this item\",\"format\":\"float\",\"nullable\":true,\"type\":\"number\"},\"unit_price\":{\"description\":\"Price per unit\",\"format\":\"float\",\"type\":\"number\"}},\"type\":\"object\"},\"nullable\":true,\"type\":\"array\"},\"receiver\":{\"description\":\"Information about the invoice receiver/customer\",\"nullable\":true,\"properties\":{\"address\":{\"description\":\"Address of the receiver\",\"nullable\":true,\"type\":\"string\"},\"name\":{\"description\":\"Name of the receiving company or customer\",\"type\":\"string\"},\"tax_id\":{\"description\":\"Tax identification number of receiver\",\"type\":\"string\"}},\"type\":\"object\"}},\"type\":\"object\"},\"success\":{\"description\":\"Indicates if the extraction was successful\",\"example\":true,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Successful extraction of invoice data\"},\"400\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"error\":{\"properties\":{\"code\":{\"example\":\"INVALID_INPUT\",\"type\":\"string\"},\"message\":{\"example\":\"Invalid base64 encoding or unsupported media type\",\"type\":\"string\"}},\"type\":\"object\"},\"success\":{\"example\":false,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Bad request - Invalid input parameters\"},\"401\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"error\":{\"properties\":{\"code\":{\"example\":\"UNAUTHORIZED\",\"type\":\"string\"},\"message\":{\"example\":\"Invalid or missing API key\",\"type\":\"string\"}},\"type\":\"object\"},\"success\":{\"example\":false,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Unauthorized - Invalid or missing API key\"},\"403\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"error\":{\"properties\":{\"code\":{\"example\":\"QUOTA_EXCEEDED\",\"type\":\"string\"},\"message\":{\"example\":\"Monthly API call quota exceeded\",\"type\":\"string\"}},\"type\":\"object\"},\"success\":{\"example\":false,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Forbidden - API key quota exceeded\"},\"413\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"error\":{\"properties\":{\"code\":{\"example\":\"FILE_TOO_LARGE\",\"type\":\"string\"},\"message\":{\"example\":\"File size exceeds maximum allowed limit\",\"type\":\"string\"}},\"type\":\"object\"},\"success\":{\"example\":false,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Payload too large - File size exceeds limit\"},\"422\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"error\":{\"properties\":{\"code\":{\"example\":\"EXTRACTION_FAILED\",\"type\":\"string\"},\"message\":{\"example\":\"Unable to extract invoice data from the provided file\",\"type\":\"string\"}},\"type\":\"object\"},\"success\":{\"example\":false,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Unprocessable entity - Unable to extract data from file\"},\"500\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"error\":{\"properties\":{\"code\":{\"example\":\"INTERNAL_ERROR\",\"type\":\"string\"},\"message\":{\"example\":\"An internal error occurred processing your request\",\"type\":\"string\"}},\"type\":\"object\"},\"success\":{\"example\":false,\"type\":\"boolean\"}},\"type\":\"object\"}}},\"description\":\"Internal server error\"}},\"security\":[{\"ApiKeyAuth\":[]}],\"securitySchemes\":{\"ApiKeyAuth\":{\"description\":\"API key authentication. Get your free API key at https://invoiceextract.com.mx/. Format: 'iek_your_key_here'\",\"in\":\"header\",\"name\":\"x-api-key\",\"type\":\"apiKey\"}},\"securitySource\":\"operation\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/extract","segments":[{"lit":"extract"}],"select":{},"transform":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"invoice_extraction","name__orig":"invoice_extraction","Name":"InvoiceExtraction","name_":"invoice_extraction","name-":"invoice-extraction","NAME":"INVOICE_EXTRACTION","index$":1}, {"active":true,"entity":"invoice_extraction","key$":"BasicInvoiceExtractionFlow","kind":"basic","name":"BasicInvoiceExtractionFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"invoice_extraction_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0}]}, 'InvoiceExtraction')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const invoice_extraction_ref01_ent = client.InvoiceExtraction()
    let invoice_extraction_ref01_data = setup.data.new.invoice_extraction['invoice_extraction_ref01']

    invoice_extraction_ref01_data = (await invoice_extraction_ref01_ent.create(invoice_extraction_ref01_data)).data()
    assert(null != invoice_extraction_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/invoice_extraction/InvoiceExtractionTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = InvoiceExtractionSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['invoice_extraction01','invoice_extraction02','invoice_extraction03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID': idmap,
    'INVOICE_EXTRACTION_TEST_LIVE': 'FALSE',
    'INVOICE_EXTRACTION_TEST_EXPLAIN': 'FALSE',
    'INVOICE_EXTRACTION_APIKEY': '',
  })

  idmap = env['INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID']

  const live = 'TRUE' === env.INVOICE_EXTRACTION_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['INVOICE_EXTRACTION_TEST_INVOICE_EXTRACTION_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new InvoiceExtractionSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.INVOICE_EXTRACTION_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.INVOICE_EXTRACTION_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
