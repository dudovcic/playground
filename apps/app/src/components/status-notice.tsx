import { Button, Card, H4, Paragraph, YStack } from "tamagui";

export function StatusNotice({
	title,
	description,
	tone = "muted",
	actionLabel,
	onAction,
}: {
	title: string;
	description: string;
	tone?: "muted" | "destructive";
	actionLabel?: string;
	onAction?: () => void;
}) {
	return (
		<Card padded>
			<YStack gap="$2">
				<H4>{title}</H4>
				<Paragraph
					size="$2"
					color={tone === "destructive" ? "$red10" : "$gray11"}
				>
					{description}
				</Paragraph>
				{actionLabel && onAction ? (
					<Button onPress={onAction}>{actionLabel}</Button>
				) : null}
			</YStack>
		</Card>
	);
}
