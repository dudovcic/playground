export interface PageQuery {
	page: number;
	limit: number;
	offset: number;
}

export interface Page<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(
	pageRaw?: string,
	limitRaw?: string,
): PageQuery {
	const pageNumber = Number.parseInt(pageRaw ?? "1", 10);
	const limitNumber = Number.parseInt(limitRaw ?? String(DEFAULT_LIMIT), 10);
	const page = Number.isFinite(pageNumber) ? Math.max(1, pageNumber) : 1;
	const limit = Number.isFinite(limitNumber)
		? Math.min(MAX_LIMIT, Math.max(1, limitNumber))
		: DEFAULT_LIMIT;

	return { page, limit, offset: (page - 1) * limit };
}

export function likeTerm(search: string): string {
	const escaped = search.replace(/[\\%_]/g, (char) => `\\${char}`);
	return `%${escaped}%`;
}
