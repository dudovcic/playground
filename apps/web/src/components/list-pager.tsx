import { Button } from "@/components/ui/button";

export function ListPager({
	page,
	total,
	limit,
	onPage,
}: {
	page: number;
	total: number;
	limit: number;
	onPage: (page: number) => void;
}) {
	if (total === 0) {
		return null;
	}

	const pages = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="mt-6 flex items-center gap-4">
			<Button
				type="button"
				variant="outline"
				disabled={page <= 1}
				onClick={() => onPage(page - 1)}
			>
				Previous
			</Button>
			<span className="text-sm text-muted-foreground">
				Page {page} of {pages}
			</span>
			<Button
				type="button"
				variant="outline"
				disabled={page >= pages}
				onClick={() => onPage(page + 1)}
			>
				Next
			</Button>
		</div>
	);
}
