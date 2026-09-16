

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


describe('HealthEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when INVOICE_EXTRACTION_TEST_LIVE=TRUE.
  afterEach(liveDelay('INVOICE_EXTRACTION_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = InvoiceExtractionSDK.test()
    const ent = testsdk.Health()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.INVOICE_EXTRACTION_TEST_LIVE
    for (const op of ['load']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'health.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"status","req":false,"type":"`$STRING`","index$":0},{"active":true,"format":"date-time","name":"timestamp","req":false,"type":"`$STRING`","index$":1}],"name":"health","op":{"load":{"input":"data","name":"load","points":[{"active":true,"args":{},"contract":{"id":"GET /health","json":"{\"operationId\":\"healthCheck\",\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"status\":{\"example\":\"healthy\",\"type\":\"string\"},\"timestamp\":{\"example\":\"2024-11-15T10:30:00Z\",\"format\":\"date-time\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Service is healthy\"}},\"security\":[],\"securitySchemes\":{\"ApiKeyAuth\":{\"description\":\"API key authentication. Get your free API key at https://invoiceextract.com.mx/. Format: 'iek_your_key_here'\",\"in\":\"header\",\"name\":\"x-api-key\",\"type\":\"apiKey\"}},\"securitySource\":\"operation\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/health","segments":[{"lit":"health"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"health","name__orig":"health","Name":"Health","name_":"health","name-":"health","NAME":"HEALTH","index$":0}, {"active":true,"entity":"health","key$":"BasicHealthFlow","kind":"basic","name":"BasicHealthFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"health_ref01","srcdatavar":"health_ref01_data","suffix":"_dt0"},"match":{},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-health_ref01"}}],"index$":0}]}, 'Health')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let health_ref01_data = Object.values(setup.data.existing.health)[0] as any

    // LOAD
    const health_ref01_ent = client.Health()
    const health_ref01_match_dt0: any = {}
    const health_ref01_data_dt0 = (await health_ref01_ent.load(health_ref01_match_dt0)).data()
    assert(null != health_ref01_data_dt0)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/health/HealthTestData.json')

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
    ['health01','health02','health03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'INVOICE_EXTRACTION_TEST_HEALTH_ENTID': idmap,
    'INVOICE_EXTRACTION_TEST_LIVE': 'FALSE',
    'INVOICE_EXTRACTION_TEST_EXPLAIN': 'FALSE',
    'INVOICE_EXTRACTION_APIKEY': '',
  })

  idmap = env['INVOICE_EXTRACTION_TEST_HEALTH_ENTID']

  const live = 'TRUE' === env.INVOICE_EXTRACTION_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['INVOICE_EXTRACTION_TEST_HEALTH_ENTID']
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
  
