import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription
					className={tone === "destructive" ? "text-destructive" : undefined}
				>
					{description}
				</CardDescription>
			</CardHeader>
			{actionLabel && onAction ? (
				<CardFooter>
					<Button type="button" onClick={onAction}>
						{actionLabel}
					</Button>
				</CardFooter>
			) : null}
		</Card>
	);
}
