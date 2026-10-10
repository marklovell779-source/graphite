import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applySpokenDims, parseIntent } from "./intent.ts";
import { decideYield, trustOfUtterance } from "./trust.ts";
import { documentToGcode, documentToStep, fallbackGeometry, geometryTo3mf, geometryToStl } from "./export.ts";

describe("trust levels", () => {
  it("treats a stated dimension as knowing", () => {
    assert.equal(trustOfUtterance("80 x 40 x 6 plate"), "knowing");
    assert.equal(trustOfUtterance("thickness 3 mm"), "knowing");
    assert.equal(trustOfUtterance("M4 clearance"), "knowing");
  });

  it("treats a bare description as guesswork", () => {
    assert.equal(trustOfUtterance("looks like a bracket"), "guesswork");
    assert.equal(trustOfUtterance("make it thicker"), "guesswork");
    assert.equal(parseIntent("phone stand")?.trust, "guesswork");
    assert.equal(parseIntent("40x40x6 plate")?.trust, "knowing");
  });
});

describe("yield rule", () => {
  it("refuses to overwrite a stated number with a guess", () => {
    const plate = parseIntent("40x40x6 plate");
    assert.ok(plate);
    const kept = applySpokenDims(plate, "looks like a coaster");
    assert.equal(kept.trust, "knowing");
    assert.equal(kept.features[0]?.params.length, 40);
    assert.equal(kept.features[0]?.params.height, 6);
    assert.match(kept.notes, /Yielded/);
    assert.equal(decideYield("knowing", "guesswork").yielded, true);
  });

  it("lets a stated number replace a guess", () => {
    const guessed = parseIntent("plate");
    assert.ok(guessed);
    assert.equal(guessed.trust, "guesswork");
    const stated = applySpokenDims(guessed, "100x20x5");
    assert.equal(stated.trust, "knowing");
    assert.equal(stated.features[0]?.params.length, 100);
    assert.equal(stated.features[0]?.params.height, 5);
    assert.equal(decideYield("guesswork", "knowing").yielded, false);
  });
});

describe("exports still write", () => {
  it("writes STL, 3MF, STEP, and G-code for a stated plate", async () => {
    const doc = parseIntent("40x40x6 plate with 4 holes");
    assert.ok(doc);
    const geo = fallbackGeometry(doc);
    const stl = new Uint8Array(await geometryToStl(geo, doc.name).arrayBuffer());
    assert.ok(stl.byteLength > 84);
    assert.equal(new DataView(stl.buffer).getUint32(80, true) > 0, true);

    const step = await documentToStep(doc).text();
    assert.match(step, /ISO-10303-21/);
    assert.match(step, /BLOCK/);

    const gcode = await documentToGcode(doc).text();
    assert.match(gcode, /G21/);
    assert.match(gcode, /G1 /);

    const mf = new Uint8Array(await (await geometryTo3mf(geo, doc.name)).arrayBuffer());
    assert.equal(mf[0], 0x50);
    assert.equal(mf[1], 0x4b);
  });
});
