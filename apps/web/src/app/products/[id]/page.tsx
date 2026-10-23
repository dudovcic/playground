import { ProductDetail } from "@/components/product-detail";

export default async function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Product</h1>
			<ProductDetail id={id} />
		</div>
	);
}
