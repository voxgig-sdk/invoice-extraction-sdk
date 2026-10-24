

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { InvoiceExtractionSDK, BaseFeature, config, stdutil } from '../../..'

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


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = InvoiceExtractionSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.InvoiceExtraction().create({"file_base64":1,"media_type":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.INVOICE_EXTRACTION_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'invoice_extraction.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"amounts":{"a":true,"h":"Amounts","n":"amounts","r":false,"sh":"Financial amounts from the invoice","t":"`$OBJECT`","key$":"amounts","index$":0},"confidence":{"a":true,"fo":"float","h":"Confidence","n":"confidence","r":false,"sh":"Confidence score of the extraction (0 to 1)","t":"`$NUMBER`","key$":"confidence","index$":1},"document":{"a":true,"h":"Document","n":"document","r":false,"sh":"Document metadata","t":"`$OBJECT`","key$":"document","index$":2},"file_base64":{"a":true,"h":"File Base64","n":"file_base64","r":true,"sh":"Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)","t":"`$STRING`","key$":"file_base64","index$":3},"issuer":{"a":true,"h":"Issuer","n":"issuer","r":false,"sh":"Information about the invoice issuer/vendor","t":"`$OBJECT`","key$":"issuer","index$":4},"items":{"a":true,"h":"Items","n":"items","r":false,"sh":"Line items from the invoice","t":"`$ARRAY`","key$":"items","index$":5},"media_type":{"a":true,"h":"Media Type","n":"media_type","r":true,"sh":"MIME type of the submitted file","t":"`$STRING`","key$":"media_type","index$":6},"receiver":{"a":true,"h":"Receiver","n":"receiver","r":false,"sh":"Information about the invoice receiver/customer","t":"`$OBJECT`","key$":"receiver","index$":7}},"name":"invoice_extraction","op":{"create":{"input":"data","name":"create","points":[{"a":true,"bf":["file_base64","media_type"],"co":{"id":"POST /extract","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/extract","q":{},"r":{},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"extract"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"invoice_extraction","name__orig":"invoice_extraction","Name":"InvoiceExtraction","name_":"invoice_extraction","name-":"invoice-extraction","NAME":"INVOICE_EXTRACTION","index$":1}, {"active":true,"entity":"invoice_extraction","key$":"BasicInvoiceExtractionFlow","kind":"basic","name":"BasicInvoiceExtractionFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"invoice_extraction_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'InvoiceExtraction', {"POST /extract":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["file_base64","media_type"],"properties":{"file_base64":{"type":"string","description":"Base64-encoded invoice file (PDF, JPG, PNG, or WEBP)","example":"JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...","key$":"file_base64"},"media_type":{"type":"string","description":"MIME type of the submitted file","enum":["application/pdf","image/jpeg","image/jpg","image/png","image/webp"],"example":"application/pdf","key$":"media_type"}},"index$":1},"examples":{"pdf_invoice":{"summary":"PDF invoice example","value":{"file_base64":"JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlL...","media_type":"application/pdf"}},"image_invoice":{"summary":"Image invoice example","value":{"file_base64":"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBg...","media_type":"image/jpeg"}}}}}},"parameters":[]}}, { strict: LIVE_STRICT, t })
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



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

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
  
