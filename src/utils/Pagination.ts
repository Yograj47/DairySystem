export interface IPaginate<T> {
    items: T[];
    currentPage: number;
    itemsPerPage: number;
}

export function paginate<T>({ items, currentPage, itemsPerPage }: IPaginate<T>) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return {
        currentPage,
        totalPages,
        items: paginatedItems,
    };
}
