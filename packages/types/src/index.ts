export interface User {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	avatar_url: string | null;
	role: string;
	is_active: number;
	created_at: string;
	updated_at: string;
}

export interface CreateUser {
	name: string;
	email: string;
	phone?: string;
}

export interface Product {
	id: number;
	name: string;
	description: string | null;
	price: number;
	sku: string;
	category: string;
	brand: string | null;
	image_url: string | null;
	thumbnail_url: string | null;
	weight: number | null;
	rating: number;
	review_count: number;
	in_stock: number;
	stock_quantity: number;
	discount_percent: number;
	tags: string | null;
	created_at: string;
	updated_at: string;
}

export interface CreateProduct {
	name: string;
	description?: string;
	price: number;
	sku: string;
	category: string;
	brand?: string;
}
