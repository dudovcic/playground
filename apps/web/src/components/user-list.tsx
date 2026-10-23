"use client";

import { formatDate } from "@zapp/utils";
import { useCallback, useEffect, useState } from "react";
import { ListPager } from "@/components/list-pager";
import { StatusNotice } from "@/components/status-notice";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface User {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	role: string;
	is_active: number;
	created_at: string;
}

interface UserPage {
	data: User[];
	page: number;
	limit: number;
	total: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";
const PAGE_SIZE = 10;

type LoadState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; page: UserPage };

function isUserPage(value: unknown): value is UserPage {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const page = value as Partial<UserPage>;
	return (
		Array.isArray(page.data) &&
		typeof page.total === "number" &&
		typeof page.page === "number" &&
		typeof page.limit === "number"
	);
}

export function UserList() {
	const [page, setPage] = useState(1);
	const [state, setState] = useState<LoadState>({ status: "loading" });

	const load = useCallback(() => {
		const params = new URLSearchParams({
			page: String(page),
			limit: String(PAGE_SIZE),
		});
		const controller = new AbortController();
		setState({ status: "loading" });
		fetch(`${API_URL}/users?${params}`, { signal: controller.signal })
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(`Request failed: ${res.status}`);
				}
				const data: unknown = await res.json();
				if (!isUserPage(data)) {
					throw new Error("Unexpected response");
				}
				setState({ status: "ready", page: data });
			})
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}
				setState({ status: "error" });
			});
		return () => controller.abort();
	}, [page]);

	useEffect(() => load(), [load]);

	if (state.status === "loading") {
		return <p className="text-sm text-muted-foreground">Loading users...</p>;
	}

	if (state.status === "error") {
		return (
			<StatusNotice
				title="Could not load users"
				description="The user service is unavailable."
				tone="destructive"
				actionLabel="Try again"
				onAction={load}
			/>
		);
	}

	if (state.page.data.length === 0) {
		return (
			<StatusNotice
				title="No users"
				description="There are no users to show."
			/>
		);
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Phone</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Active</TableHead>
						<TableHead>Created</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{state.page.data.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.id}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.phone || "—"}</TableCell>
							<TableCell>{user.role}</TableCell>
							<TableCell>{user.is_active ? "Yes" : "No"}</TableCell>
							<TableCell>{formatDate(user.created_at)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<ListPager
				page={state.page.page}
				total={state.page.total}
				limit={state.page.limit}
				onPage={setPage}
			/>
		</div>
	);
}
