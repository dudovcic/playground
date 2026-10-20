export interface Product {
	id: number;
	name: string;
	description: string | null;
	price: number;
	sku: string;
	category: string;
	brand: string | null;
	image_url: string | null;
	rating: number;
	review_count: number;
	in_stock: number;
	stock_quantity: number;
	discount_percent: number;
}

export function productPath(id: number | string): string {
	return `/products/${id}`;
}

export function isInStock(inStock: number): boolean {
	return Boolean(inStock);
}
