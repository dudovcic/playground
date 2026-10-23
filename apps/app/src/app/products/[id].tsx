import { formatCurrency } from "@zapp/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Button, Card, H4, Paragraph, Text, XStack, YStack } from "tamagui";
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
	| { status: "missing" }
	| { status: "ready"; product: Product };

function isProduct(value: unknown): value is Product {
	return (
		typeof value === "object" &&
		value !== null &&
		"id" in value &&
		"name" in value &&
		"price" in value
	);
}

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [state, setState] = useState<LoadState>({ status: "loading" });

	const load = useCallback(() => {
		setState({ status: "loading" });
		fetch(`${API_URL}/products/${id}`)
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(`Request failed: ${res.status}`);
				}
				const text = await res.text();
				if (!text) {
					setState({ status: "missing" });
					return;
				}
				const data: unknown = JSON.parse(text);
				if (!isProduct(data)) {
					setState({ status: "missing" });
					return;
				}
				setState({ status: "ready", product: data });
			})
			.catch(() => setState({ status: "error" }));
	}, [id]);

	useEffect(() => {
		load();
	}, [load]);

	if (state.status === "loading") {
		return (
			<YStack flex={1} padding="$4">
				<Paragraph size="$2" color="$gray11">
					Loading product...
				</Paragraph>
			</YStack>
		);
	}

	if (state.status === "error") {
		return (
			<YStack flex={1} padding="$4">
				<StatusNotice
					title="Could not load product"
					description="The product service is unavailable."
					tone="destructive"
					actionLabel="Try again"
					onAction={load}
				/>
			</YStack>
		);
	}

	if (state.status === "missing") {
		return (
			<YStack flex={1} padding="$4">
				<StatusNotice
					title="No product"
					description="There is no product to show."
				/>
			</YStack>
		);
	}

	const { product } = state;

	return (
		<YStack flex={1} padding="$4" gap="$4">
			<Card padded>
				<H4>{product.name}</H4>
				<Text fontSize="$2" color="$gray10">
					{product.brand} · {product.category}
				</Text>
				<XStack gap="$2" alignItems="center" marginTop="$2">
					<Text fontSize="$6" fontWeight="bold">
						{formatCurrency(product.price)}
					</Text>
					{product.discount_percent > 0 && (
						<Text fontSize="$2" color="$red10">
							-{product.discount_percent}%
						</Text>
					)}
				</XStack>
				<Paragraph size="$2" color="$gray11" marginTop="$1">
					{product.description}
				</Paragraph>
				<XStack gap="$2" alignItems="center" marginTop="$2">
					<Text
						fontSize="$2"
						color={product.in_stock ? "$green10" : "$red10"}
					>
						{product.in_stock ? "In Stock" : "Out of Stock"}
					</Text>
					<Text fontSize="$2" color="$gray10">
						·
					</Text>
					<Text fontSize="$2" color="$gray10">
						SKU: {product.sku}
					</Text>
				</XStack>
				<Text fontSize="$2" color="$gray10" marginTop="$2">
					{product.rating} rating · {product.review_count} reviews ·{" "}
					{product.stock_quantity} in stock
				</Text>
			</Card>
			<Button onPress={() => router.back()}>Back to products</Button>
		</YStack>
	);
}
