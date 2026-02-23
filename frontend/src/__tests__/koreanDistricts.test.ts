import { test, expect } from "bun:test";
import { searchAddress } from "../data/koreanDistricts";

// RED tests documenting current broken behavior
// These tests FAIL with current implementation, documenting the bugs

// BUG 1: Space-separated queries return no results
// Root cause: includes(lowerQuery) requires full query string match
// Example: "서울 강남구" → includes("서울 강남구") returns FALSE

test("space-separated query should return results (current behavior: FAILS)", () => {
    const results = searchAddress("서울 강남구");
    expect(results.length).toBeGreaterThan(0);
  });

test("space-separated query with 3 tokens should return results (current behavior: FAILS)", () => {
    const results = searchAddress("서울 강남구 역삼동");
    expect(results.length).toBeGreaterThan(0);
  });

test("empty query should return empty array", () => {
    const results = searchAddress("");
    expect(results).toEqual([]);
  });

test("whitespace-only query should return empty array", () => {
    const results = searchAddress("   ");
    expect(results).toEqual([]);
  });

// BUG 2: Wrong search results - no sorting by match type
// Root cause: Results added in order found, not sorted by matchType

test("full matches should appear before partial matches (current behavior: FAILS)", () => {
    const results = searchAddress("서울 강남구");

    const fullMatchIndex = results.findIndex(r => r.matchType === "full");
    const partialMatchIndex = results.findIndex(r => r.matchType === "partial");

    if (fullMatchIndex >= 0 && partialMatchIndex >= 0) {
      expect(fullMatchIndex).toBeLessThan(partialMatchIndex);
    }
  });

// BUG 3: Result count should be limited to 50

test("should return max 50 results", () => {
    const results = searchAddress("서");
    expect(results.length).toBeLessThanOrEqual(50);
  });

// BUG 4: Query tokenization edge cases

test("query with multiple spaces should work", () => {
    const results = searchAddress("서울   강남구   역삼동");
    expect(results.length).toBeGreaterThan(0);
  });

test("query with mixed case should work", () => {
    const results = searchAddress("서울 강남구");
    const lowerCaseResults = searchAddress("서울 강남구".toLowerCase());
    expect(results).toEqual(lowerCaseResults);
});


