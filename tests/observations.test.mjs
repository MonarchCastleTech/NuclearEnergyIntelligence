import assert from "node:assert/strict";
import test from "node:test";
import { latestObservations, validateCoverage } from "../scripts/observations.mjs";

test("ignores missing and invalid observations without turning them into zero", () => {
  const rows = ["Entity,Code,Year,Nuclear", "A,AAA,2023,12.5", "A,AAA,2024,", "B,BBB,2025,0", "C,CCC,2025,101"];
  const result = latestObservations(rows, (line) => line.split(","));
  assert.deepEqual(result.get("A"), { year: 2023, value: 12.5 });
  assert.deepEqual(result.get("B"), { year: 2025, value: 0 });
  assert.equal(result.has("C"), false);
});

test("rejects incomplete coverage and accepts a complete current selection", () => {
  assert.throws(() => validateCoverage(22, 23, 2025, 2026), /22\/23/);
  assert.throws(() => validateCoverage(0, 0, 2025, 2026));
  assert.throws(() => validateCoverage(23, 23, 2022, 2026));
  assert.throws(() => validateCoverage(23, 23, 2027, 2026));
  assert.doesNotThrow(() => validateCoverage(23, 23, 2025, 2026));
});
