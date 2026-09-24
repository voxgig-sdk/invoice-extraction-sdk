
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { InvoiceExtractionSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = InvoiceExtractionSDK.test()
    equal(testsdk instanceof InvoiceExtractionSDK, true,
      'InvoiceExtractionSDK.test() must return a client synchronously')
  })

})
