"use client";

import { formatCurrency } from "@zapp/utils";
import { useCallback, useEffect, useState } from "react";
import { StatusNotice } from "@/components/status-notice";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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

export function ProductDetail({ id }: { id: string }) {
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
		return <p className="text-sm text-muted-foreground">Loading product...</p>;
	}

	if (state.status === "error") {
		return (
			<StatusNotice
				title="Could not load product"
				description="The product service is unavailable."
				tone="destructive"
				actionLabel="Try again"
				onAction={load}
			/>
		);
	}

	if (state.status === "missing") {
		return (
			<StatusNotice
				title="No product"
				description="There is no product to show."
			/>
		);
	}

	const { product } = state;

	return (
		<Card>
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
				<div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
					<span>{product.rating} rating</span>
					<span>·</span>
					<span>{product.review_count} reviews</span>
					<span>·</span>
					<span>{product.stock_quantity} in stock</span>
				</div>
			</CardContent>
			<CardFooter>
				<Button variant="outline" asChild>
					<a href="/products">Back to products</a>
				</Button>
			</CardFooter>
		</Card>
	);
}
