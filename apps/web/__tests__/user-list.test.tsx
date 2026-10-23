import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UserList } from "../src/components/user-list";

function userPage(data: unknown[], total = data.length) {
	return { data, page: 1, limit: 10, total };
}

const user = {
	id: 1,
	name: "Alice Johnson",
	email: "alice@example.com",
	phone: null,
	role: "admin",
	is_active: 1,
	created_at: "2026-10-20T11:50:09Z",
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("UserList", () => {
	it("shows the same user fields as the table", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => userPage([user]),
			}),
		);

		render(<UserList />);

		expect(await screen.findByText("Alice Johnson")).toBeDefined();
		expect(screen.getByText("alice@example.com")).toBeDefined();
		expect(screen.getByText("—")).toBeDefined();
		expect(screen.getByText("admin")).toBeDefined();
		expect(screen.getByText("Yes")).toBeDefined();
	});

	it("shows an empty state when the API returns no users", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => userPage([]),
			}),
		);

		render(<UserList />);

		expect(await screen.findByText("No users")).toBeDefined();
	});

	it("shows an error when the API is unreachable", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

		render(<UserList />);

		expect(await screen.findByText("Could not load users")).toBeDefined();
	});
});
