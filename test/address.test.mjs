import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { parseDirectPeerAddress } = require("../dist/address.js")

describe("parseDirectPeerAddress", () => {
  it("keeps bare IPv6 literals intact and uses the default port", () => {
    assert.deepEqual(parseDirectPeerAddress("2001:db8::1", 8099), {
      address: "2001:db8::1",
      port: 8099,
    })
  })

  it("strips brackets from IPv6 literals with explicit ports", () => {
    assert.deepEqual(parseDirectPeerAddress("[2001:db8::1]:8123", 8099), {
      address: "2001:db8::1",
      port: 8123,
    })
  })
})
