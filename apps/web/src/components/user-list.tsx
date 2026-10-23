"use client";

import { formatDate } from "@zapp/utils";
import { useCallback, useEffect, useState } from "react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";

type LoadState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; users: User[] };

export function UserList() {
	const [state, setState] = useState<LoadState>({ status: "loading" });

	const load = useCallback(() => {
		setState({ status: "loading" });
		fetch(`${API_URL}/users`)
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(`Request failed: ${res.status}`);
				}
				const data: unknown = await res.json();
				if (!Array.isArray(data)) {
					throw new Error("Unexpected response");
				}
				setState({ status: "ready", users: data as User[] });
			})
			.catch(() => setState({ status: "error" }));
	}, []);

	useEffect(() => {
		load();
	}, [load]);

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

	if (state.users.length === 0) {
		return (
			<StatusNotice
				title="No users"
				description="There are no users to show."
			/>
		);
	}

	return (
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
				{state.users.map((user) => (
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
	);
}
