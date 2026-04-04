export type CategoryConfig = {
    slug: string;
    name: string;
};

const CATEGORIES: CategoryConfig[] = [
    { slug: 'dash-cam', name: 'Dash Cam' },
    { slug: 'floor-mats', name: 'Floor Mats' },
    { slug: 'seat-covers', name: 'Seat Covers' },
    { slug: 'cargo-liner', name: 'Cargo Liner' },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
    return CATEGORIES.find((item) => item.slug === slug);
}

export function getAllCategories(): CategoryConfig[] {
    return CATEGORIES;
}

export function isValidCategorySlug(slug: string): boolean {
    return CATEGORIES.some((item) => item.slug === slug);
}