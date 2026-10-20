import { formatCurrency } from "@zapp/utils";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import { H2, Paragraph, Spinner, Text, XStack, YStack } from "tamagui";
import { API_URL } from "../../lib/api";
import { isInStock, type Product } from "../../lib/product";

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);

	useEffect(() => {
		if (!id) {
			setLoading(false);
			setNotFound(true);
			return;
		}

		let cancelled = false;

		fetch(`${API_URL}/products/${id}`)
			.then(async (res) => {
				if (!res.ok) {
					throw new Error("Product request failed");
				}
				return res.json();
			})
			.then((data: Product | null) => {
				if (cancelled) {
					return;
				}
				if (!data?.id) {
					setNotFound(true);
					setProduct(null);
				} else {
					setProduct(data);
					setNotFound(false);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setNotFound(true);
					setProduct(null);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [id]);

	return (
		<>
			<Stack.Screen options={{ title: product?.name ?? "Product" }} />
			{loading ? (
				<YStack flex={1} alignItems="center" justifyContent="center">
					<Spinner size="large" />
				</YStack>
			) : notFound || !product ? (
				<YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
					<Text>Product not found.</Text>
				</YStack>
			) : (
				<ScrollView>
					<YStack padding="$4" gap="$3">
						{product.image_url ? (
							<Image
								source={{ uri: product.image_url }}
								style={{ width: "100%", height: 240, borderRadius: 12 }}
								resizeMode="cover"
							/>
						) : null}
						<H2>{product.name}</H2>
						<Text fontSize="$2" color="$gray10">
							{[product.brand, product.category].filter(Boolean).join(" · ")}
						</Text>
						<XStack gap="$2" alignItems="center">
							<Text fontSize="$8" fontWeight="bold">
								{formatCurrency(product.price)}
							</Text>
							{product.discount_percent > 0 ? (
								<Text fontSize="$3" color="$red10">
									-{product.discount_percent}%
								</Text>
							) : null}
						</XStack>
						<Text
							fontSize="$3"
							color={isInStock(product.in_stock) ? "$green10" : "$red10"}
						>
							{isInStock(product.in_stock)
								? `In Stock${product.stock_quantity ? ` · ${product.stock_quantity} available` : ""}`
								: "Out of Stock"}
						</Text>
						{product.sku ? (
							<Text fontSize="$2" color="$gray10">
								SKU: {product.sku}
							</Text>
						) : null}
						{product.rating ? (
							<Text fontSize="$2" color="$gray10">
								{product.rating} · {product.review_count} reviews
							</Text>
						) : null}
						{product.description ? (
							<Paragraph color="$gray11">{product.description}</Paragraph>
						) : null}
					</YStack>
				</ScrollView>
			)}
		</>
	);
}
