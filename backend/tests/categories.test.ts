import test from "node:test";
import assert from "node:assert/strict";
import { classifyExpense } from "../src/utils/categories";

test("classifyExpense uses deterministic merchant mapping first", () => {
  const result = classifyExpense("Netflix");
  assert.equal(result.category, "Subscriptions");
  assert.equal(result.confidence, "rule");
});

test("classifyExpense falls back when no mapping exists", () => {
  const result = classifyExpense("Unknown Vendor");
  assert.equal(result.category, "Other");
  assert.equal(result.confidence, "low");
});

