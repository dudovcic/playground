"use client";

import { formatCurrency } from "@zapp/utils";
import { useCallback, useEffect, useState } from "react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4992";

type LoadState =
	| { status: "loading" }
	| { status: "error" }
	| { status: "ready"; products: Product[] };

export function ProductList() {
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
		return <p className="text-sm text-muted-foreground">Loading products...</p>;
	}

	if (state.status === "error") {
		return (
			<StatusNotice
				title="Could not load products"
				description="The product service is unavailable."
				tone="destructive"
				actionLabel="Try again"
				onAction={load}
			/>
		);
	}

	if (state.products.length === 0) {
		return (
			<StatusNotice
				title="No products"
				description="There are no products to show."
			/>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{state.products.map((product) => (
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
	);
}
