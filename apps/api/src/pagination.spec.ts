import { describe, expect, it } from "vitest";
import { likeTerm, parsePagination } from "./pagination";

describe("parsePagination", () => {
	it("defaults to the first page of 20", () => {
		expect(parsePagination()).toEqual({ page: 1, limit: 20, offset: 0 });
	});

	it("clamps invalid page and limit values", () => {
		expect(parsePagination("0", "500")).toEqual({
			page: 1,
			limit: 100,
			offset: 0,
		});
		expect(parsePagination("nope", "0")).toEqual({
			page: 1,
			limit: 1,
			offset: 0,
		});
	});

	it("offsets later pages", () => {
		expect(parsePagination("3", "10")).toEqual({
			page: 3,
			limit: 10,
			offset: 20,
		});
	});
});

describe("likeTerm", () => {
	it("wraps the search and escapes LIKE wildcards", () => {
		expect(likeTerm("100%")).toBe("%100\\%%");
		expect(likeTerm("a_b")).toBe("%a\\_b%");
	});
});
