"use client";

import { formatCurrency } from "@zapp/utils";
import { useCallback, useEffect, useState } from "react";
import { ListPager } from "@/components/list-pager";
import { StatusNotice } from "@/components/status-notice";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

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

interface ProductPage {
	data: Product[];
	page: number;
	limit: number;
	total: number;
	categories: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";
const PAGE_SIZE = 12;

type LoadState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; page: ProductPage };

function isProductPage(value: unknown): value is ProductPage {
	if (typeof value !== "object" || value === null) {
		return false;
	}
	const page = value as Partial<ProductPage>;
	return (
		Array.isArray(page.data) &&
		Array.isArray(page.categories) &&
		typeof page.total === "number" &&
		typeof page.page === "number" &&
		typeof page.limit === "number"
	);
}

export function ProductList() {
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [category, setCategory] = useState("");
	const [page, setPage] = useState(1);
	const [categories, setCategories] = useState<string[]>([]);
	const [state, setState] = useState<LoadState>({ status: "loading" });

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
		return () => clearTimeout(timeout);
	}, [search]);

	const load = useCallback(() => {
		const params = new URLSearchParams({
			page: String(page),
			limit: String(PAGE_SIZE),
		});
		if (debouncedSearch) {
			params.set("search", debouncedSearch);
		}
		if (category) {
			params.set("category", category);
		}

		const controller = new AbortController();
		setState({ status: "loading" });
		fetch(`${API_URL}/products?${params}`, { signal: controller.signal })
			.then(async (res) => {
				if (!res.ok) {
					throw new Error(`Request failed: ${res.status}`);
				}
				const data: unknown = await res.json();
				if (!isProductPage(data)) {
					throw new Error("Unexpected response");
				}
				setCategories(data.categories);
				setState({ status: "ready", page: data });
			})
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}
				setState({ status: "error" });
			});

		return () => controller.abort();
	}, [page, debouncedSearch, category]);

	useEffect(() => load(), [load]);

	const filtered = debouncedSearch.length > 0 || category.length > 0;

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
				<input
					aria-label="Search products"
					placeholder="Search products"
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
					className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm sm:max-w-xs"
				/>
				<select
					aria-label="Category"
					value={category}
					onChange={(event) => {
						setCategory(event.target.value);
						setPage(1);
					}}
					className="h-9 rounded-md border border-input bg-background px-3 text-sm"
				>
					<option value="">All categories</option>
					{categories.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
				</select>
			</div>
			<ProductResults
				state={state}
				filtered={filtered}
				onRetry={() => load()}
				onPage={setPage}
			/>
		</div>
	);
}

function ProductResults({
	state,
	filtered,
	onRetry,
	onPage,
}: {
	state: LoadState;
	filtered: boolean;
	onRetry: () => void;
	onPage: (page: number) => void;
}) {
	if (state.status === "loading") {
		return <p className="text-sm text-muted-foreground">Loading products...</p>;
	}

	if (state.status === "error") {
		return (
			<StatusNotice
				title="Could not load products"
				description="The product service is unavailable."
				tone="destructive"
				actionLabel="Try again"
				onAction={onRetry}
			/>
		);
	}

	if (state.page.data.length === 0) {
		return (
			<StatusNotice
				title="No products"
				description={
					filtered
						? "No products match this search."
						: "There are no products to show."
				}
			/>
		);
	}

	return (
		<div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{state.page.data.map((product) => (
					<a
						key={product.id}
						href={`/products/${product.id}`}
						className="block rounded-xl text-foreground no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						<Card className="h-full transition-colors hover:bg-muted/50">
							<CardHeader>
								<CardTitle>{product.name}</CardTitle>
								<CardDescription>
									{product.brand} · {product.category}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<span className="text-2xl font-bold">
										{formatCurrency(product.price)}
									</span>
									{product.discount_percent > 0 && (
										<span className="text-sm text-destructive">
											-{product.discount_percent}%
										</span>
									)}
								</div>
								<p className="mt-2 text-sm text-muted-foreground">
									{product.description}
								</p>
								<div className="mt-3 flex items-center gap-2 text-sm">
									<span>{product.in_stock ? "In Stock" : "Out of Stock"}</span>
									<span>·</span>
									<span>SKU: {product.sku}</span>
								</div>
							</CardContent>
						</Card>
					</a>
				))}
			</div>
			<ListPager
				page={state.page.page}
				total={state.page.total}
				limit={state.page.limit}
				onPage={onPage}
			/>
		</div>
	);
}
