import { getCategoryBySlug } from './categories';

export type ProductCard = {
    id: string;
    title: string;
    href: string;
};

export type VehiclePageData = {
    handle: string;
    year: string;
    make: string;
    model: string;
    title: string;
    description: string;
    categories: string[];
    featuredProductsByCategory: Record<string, ProductCard[]>;
};

export type MakePageData = {
    make: string;
    makeSlug: string;
    title: string;
    description: string;
    models: string[];
    featuredVehicles: VehiclePageData[];
};

export type MakeModelPageData = {
    make: string;
    makeSlug: string;
    model: string;
    modelSlug: string;
    title: string;
    description: string;
    vehicles: VehiclePageData[];
    categories: string[];
};

export type VehicleCategoryPageData = {
    category: {
        slug: string;
        name: string;
    };
    vehiclePage: VehiclePageData;
    products: ProductCard[];
};

export type VehicleOrMakeResolvedPage =
    | {
        pageType: 'make';
        data: MakePageData;
    }
    | {
        pageType: 'vehicle';
        data: VehiclePageData;
    };

const VEHICLE_PAGES: VehiclePageData[] = [
    {
        handle: '2021-mercedes-benz-gls-custom-fit-accessories',
        year: '2021',
        make: 'Mercedes-Benz',
        model: 'GLS',
        title: '2021 Mercedes-Benz GLS Custom Fit Accessories',
        description:
            'Shop custom-fit accessories for the 2021 Mercedes-Benz GLS, including dash cams, floor mats, seat covers, and cargo solutions.',
        categories: ['dash-cam', 'floor-mats', 'seat-covers'],
        featuredProductsByCategory: {
            'dash-cam': [
                {
                    id: 'p1',
                    title: '4K Front + Rear Dash Cam for Mercedes-Benz GLS',
                    href: '/products/4k-front-rear-dash-cam-mercedes-benz-gls',
                },
            ],
            'floor-mats': [
                {
                    id: 'p2',
                    title: 'All-Weather Floor Mats for Mercedes-Benz GLS',
                    href: '/products/all-weather-floor-mats-mercedes-benz-gls',
                },
            ],
            'seat-covers': [
                {
                    id: 'p3',
                    title: 'Premium Seat Covers for Mercedes-Benz GLS',
                    href: '/products/premium-seat-covers-mercedes-benz-gls',
                },
            ],
        },
    },
    {
        handle: '2022-mercedes-benz-gls-custom-fit-accessories',
        year: '2022',
        make: 'Mercedes-Benz',
        model: 'GLS',
        title: '2022 Mercedes-Benz GLS Custom Fit Accessories',
        description: 'Browse custom-fit accessories for the 2022 Mercedes-Benz GLS.',
        categories: ['dash-cam', 'floor-mats'],
        featuredProductsByCategory: {
            'dash-cam': [
                {
                    id: 'p4',
                    title: 'OEM Style Dash Cam for 2022 Mercedes-Benz GLS',
                    href: '/products/oem-style-dash-cam-2022-mercedes-benz-gls',
                },
            ],
            'floor-mats': [
                {
                    id: 'p5',
                    title: 'Floor Mats for 2022 Mercedes-Benz GLS',
                    href: '/products/floor-mats-2022-mercedes-benz-gls',
                },
            ],
        },
    },
    {
        handle: '2021-mercedes-benz-g-class-custom-fit-accessories',
        year: '2021',
        make: 'Mercedes-Benz',
        model: 'G-Class',
        title: '2021 Mercedes-Benz G-Class Custom Fit Accessories',
        description: 'Shop custom-fit accessories for the 2021 Mercedes-Benz G-Class.',
        categories: ['dash-cam', 'cargo-liner'],
        featuredProductsByCategory: {
            'dash-cam': [
                {
                    id: 'p6',
                    title: 'Dash Cam for Mercedes-Benz G-Class',
                    href: '/products/dash-cam-mercedes-benz-g-class',
                },
            ],
            'cargo-liner': [
                {
                    id: 'p7',
                    title: 'Cargo Liner for Mercedes-Benz G-Class',
                    href: '/products/cargo-liner-mercedes-benz-g-class',
                },
            ],
        },
    },
];

function slugify(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/\s+/g, '-');
}

export async function getVehiclePageData(
    handle?: string,
): Promise<VehiclePageData | null> {
    if (!handle) return null;
    return VEHICLE_PAGES.find((item) => item.handle === handle) ?? null;
}

export async function getMakePageData(
    makeSlug?: string,
): Promise<MakePageData | null> {
    if (!makeSlug) return null;

    const matches = VEHICLE_PAGES.filter(
        (item) => slugify(item.make) === makeSlug,
    );

    if (matches.length === 0) return null;

    const make = matches[0].make;
    const models = Array.from(new Set(matches.map((item) => item.model))).sort();

    return {
        make,
        makeSlug,
        title: `${make} Custom Fit Accessories`,
        description: `Browse all custom-fit accessories by model for ${make}.`,
        models,
        featuredVehicles: matches.slice(0, 24),
    };
}

export async function getMakeModelPageData(
    makeSlug?: string,
    modelSlug?: string,
): Promise<MakeModelPageData | null> {
    if (!makeSlug || !modelSlug) return null;

    const matches = VEHICLE_PAGES.filter(
        (item) =>
            slugify(item.make) === makeSlug &&
            slugify(item.model) === modelSlug,
    );

    if (matches.length === 0) return null;

    const categories = Array.from(
        new Set(matches.flatMap((item) => item.categories)),
    );

    return {
        make: matches[0].make,
        makeSlug,
        model: matches[0].model,
        modelSlug,
        title: `${matches[0].make} ${matches[0].model} Custom Fit Accessories`,
        description: `Browse year-specific custom-fit accessories for ${matches[0].make} ${matches[0].model}.`,
        vehicles: matches.sort((a, b) => Number(b.year) - Number(a.year)),
        categories,
    };
}

export async function getVehicleCategoryPageData(
    categorySlug?: string,
    handle?: string,
): Promise<VehicleCategoryPageData | null> {
    if (!categorySlug || !handle) return null;

    const vehiclePage = await getVehiclePageData(handle);
    if (!vehiclePage) return null;

    const category = getCategoryBySlug(categorySlug);
    if (!category) return null;

    if (!vehiclePage.categories.includes(categorySlug)) {
        return null;
    }

    const products = vehiclePage.featuredProductsByCategory[categorySlug] ?? [];

    return {
        category,
        vehiclePage,
        products,
    };
}

export async function getVehicleOrMakePageData(
    slug?: string,
): Promise<VehicleOrMakeResolvedPage | null> {
    if (!slug) return null;

    const makePage = await getMakePageData(slug);
    if (makePage) {
        return {
            pageType: 'make',
            data: makePage,
        };
    }

    const vehiclePage = await getVehiclePageData(slug);
    if (vehiclePage) {
        return {
            pageType: 'vehicle',
            data: vehiclePage,
        };
    }

    return null;
}