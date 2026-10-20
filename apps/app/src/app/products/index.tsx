import { formatCurrency } from "@zapp/utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable } from "react-native";
import { Card, H4, Paragraph, Separator, Text, XStack, YStack } from "tamagui";
import { API_URL } from "../../lib/api";
import { isInStock, type Product, productPath } from "../../lib/product";

export default function ProductsScreen() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		fetch(`${API_URL}/products`)
			.then((res) => res.json())
			.then(setProducts)
			.catch(console.error);
	}, []);

	return (
		<YStack flex={1} padding="$2">
			<FlatList
				data={products}
				keyExtractor={(item) => String(item.id)}
				ItemSeparatorComponent={() => <Separator marginVertical="$2" />}
				renderItem={({ item }) => (
					<Pressable onPress={() => router.push(productPath(item.id))}>
						<Card padding="$4">
							<H4>{item.name}</H4>
							<XStack gap="$2" alignItems="center">
								<Text fontSize="$6" fontWeight="bold">
									{formatCurrency(item.price)}
								</Text>
								<Text fontSize="$2" color="$gray10">
									{item.brand} · {item.category}
								</Text>
							</XStack>
							{item.description && (
								<Paragraph size="$2" color="$gray11" marginTop="$1">
									{item.description}
								</Paragraph>
							)}
							<Text
								fontSize="$2"
								marginTop="$2"
								color={isInStock(item.in_stock) ? "$green10" : "$red10"}
							>
								{isInStock(item.in_stock) ? "In Stock" : "Out of Stock"}
							</Text>
						</Card>
					</Pressable>
				)}
			/>
		</YStack>
	);
}
