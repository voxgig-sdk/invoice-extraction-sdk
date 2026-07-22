
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { InvoiceExtractionSDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await InvoiceExtractionSDK.test()
    equal(null !== testsdk, true)
  })

})
