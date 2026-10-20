import { TamaguiProvider } from "tamagui";
import { Stack } from "expo-router";
import tamaguiConfig from "../tamagui.config";

export default function RootLayout() {
	return (
		<TamaguiProvider config={tamaguiConfig}>
			<Stack>
				<Stack.Screen name="index" options={{ title: "Zapp" }} />
				<Stack.Screen name="users" options={{ title: "Users" }} />
				<Stack.Screen name="products/index" options={{ title: "Products" }} />
				<Stack.Screen name="products/[id]" options={{ title: "Product" }} />
			</Stack>
		</TamaguiProvider>
	);
}
