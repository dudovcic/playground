import { formatCurrency } from "@zapp/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Card, H4, Paragraph, Separator, Text, XStack, YStack } from "tamagui";
import { StatusNotice } from "../../components/status-notice";

interface Product {
	id: number;
	name: string;
	description: string | null;
	price: number;
	sku: string;
	category: string;
	brand: string | null;
	rating: number;
	review_count: number;
	in_stock: number;
	stock_quantity: number;
	discount_percent: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4992";

type LoadState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; products: Product[] };

export default function ProductsScreen() {
	const router = useRouter();
	const [state, setState] = useState<LoadState>({ status: "loading" });

	const load = useCallback(() => {
		setState({ status: "loading" });
		fetch(`${API_URL}/products`)
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(`Request failed: ${res.status}`);
				}
				const data: unknown = await res.json();
				if (!Array.isArray(data)) {
					throw new Error("Unexpected response");
				}
				setState({ status: "ready", products: data as Product[] });
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
					Loading products...
				</Paragraph>
			</YStack>
		);
	}

	if (state.status === "error") {
		return (
			<YStack flex={1} padding="$4">
				<StatusNotice
					title="Could not load products"
					description="The product service is unavailable."
					tone="destructive"
					actionLabel="Try again"
					onAction={load}
				/>
			</YStack>
		);
	}

	if (state.products.length === 0) {
		return (
			<YStack flex={1} padding="$4">
				<StatusNotice
					title="No products"
					description="There are no products to show."
				/>
			</YStack>
		);
	}

	return (
		<YStack flex={1} padding="$2">
			<FlatList
				data={state.products}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <Separator marginVertical="$2" />}
				renderItem={({ item }) => (
					<Card
						padded
						onPress={() => router.push(`/products/${item.id}`)}
					>
						<H4>{item.name}</H4>
						<Text fontSize="$2" color="$gray10">
							{item.brand} · {item.category}
						</Text>
						<XStack gap="$2" alignItems="center" marginTop="$2">
							<Text fontSize="$6" fontWeight="bold">
								{formatCurrency(item.price)}
							</Text>
							{item.discount_percent > 0 && (
								<Text fontSize="$2" color="$red10">
									-{item.discount_percent}%
								</Text>
							)}
						</XStack>
						<Paragraph size="$2" color="$gray11" marginTop="$1">
							{item.description}
						</Paragraph>
						<XStack gap="$2" alignItems="center" marginTop="$2">
							<Text
								fontSize="$2"
								color={item.in_stock ? "$green10" : "$red10"}
							>
								{item.in_stock ? "In Stock" : "Out of Stock"}
							</Text>
							<Text fontSize="$2" color="$gray10">
								·
							</Text>
							<Text fontSize="$2" color="$gray10">
								SKU: {item.sku}
							</Text>
						</XStack>
					</Card>
				)}
			/>
		</YStack>
	);
}
