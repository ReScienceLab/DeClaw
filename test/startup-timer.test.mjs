import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

// Verify the fix by inspecting the compiled output for _startupTimer cleanup
const source = fs.readFileSync(
  new URL("../dist/index.js", import.meta.url),
  "utf8"
);

describe("startup timer cleanup", () => {
  it("saves setTimeout handle to _startupTimer", () => {
    assert.ok(
      source.includes("_startupTimer = setTimeout"),
      "start() should assign setTimeout to _startupTimer"
    );
  });

  it("clears _startupTimer in stop()", () => {
    assert.ok(
      source.includes("clearTimeout(_startupTimer)"),
      "stop() should call clearTimeout(_startupTimer)"
    );
  });

  it("nullifies _startupTimer after clearTimeout", () => {
    const stopBlock = source.slice(source.indexOf("clearTimeout(_startupTimer)"));
    assert.ok(
      stopBlock.includes("_startupTimer = null"),
      "stop() should set _startupTimer = null after clearing"
    );
  });

  it("nullifies _startupTimer inside the callback", () => {
    // After the timer fires, _startupTimer should be set to null
    // so stop() doesn't try to clear an already-executed timer
    const callbackIdx = source.indexOf("_startupTimer = setTimeout");
    const afterCallback = source.slice(callbackIdx, callbackIdx + 300);
    assert.ok(
      afterCallback.includes("_startupTimer = null"),
      "setTimeout callback should set _startupTimer = null on entry"
    );
  });
});
