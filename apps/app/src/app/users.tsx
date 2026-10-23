import { formatDate } from "@zapp/utils";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ListItem, Paragraph, Separator, Text, YStack } from "tamagui";
import { StatusNotice } from "../components/status-notice";

interface User {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	role: string;
	is_active: number;
	created_at: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4992";

type LoadState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; users: User[] };

export default function UsersScreen() {
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
		return (
			<YStack flex={1} padding="$4">
				<Paragraph size="$2" color="$gray11">
					Loading users...
				</Paragraph>
			</YStack>
		);
	}

	if (state.status === "error") {
		return (
			<YStack flex={1} padding="$4">
				<StatusNotice
					title="Could not load users"
					description="The user service is unavailable."
					tone="destructive"
					actionLabel="Try again"
					onAction={load}
				/>
			</YStack>
		);
	}

	if (state.users.length === 0) {
		return (
			<YStack flex={1} padding="$4">
				<StatusNotice
					title="No users"
					description="There are no users to show."
				/>
			</YStack>
		);
	}

	return (
		<YStack flex={1}>
			<FlatList
				data={state.users}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <Separator />}
				renderItem={({ item }) => (
					<ListItem title={item.name} subTitle={item.email}>
						<Text fontSize="$2" color="$gray10">
							ID {item.id} · {item.phone || "—"} · {item.role} ·{" "}
							{item.is_active ? "Yes" : "No"} · {formatDate(item.created_at)}
						</Text>
					</ListItem>
				)}
			/>
		</YStack>
	);
}
