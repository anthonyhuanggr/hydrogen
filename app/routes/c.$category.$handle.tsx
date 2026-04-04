import { Link } from 'react-router';
import type { Route } from './+types/c.$category.$handle';
import { getVehicleCategoryPageData } from '~/lib/vehicle-pages';

function formatTitle(
    categoryName: string,
    year: string,
    make: string,
    model: string,
) {
    return `${categoryName} for ${year} ${make} ${model} | CustomFitCar`;
}

export function meta({ data, params }: Route.MetaArgs) {
    if (!data?.categoryPage) {
        return [{ title: 'Category Page Not Found | CustomFitCar' }];
    }

    const { category, vehiclePage } = data.categoryPage;

    return [
        {
            title: formatTitle(
                category.name,
                vehiclePage.year,
                vehiclePage.make,
                vehiclePage.model,
            ),
        },
        {
            name: 'description',
            content: `Shop ${category.name.toLowerCase()} for the ${vehiclePage.year} ${vehiclePage.make} ${vehiclePage.model}.`,
        },
        {
            tagName: 'link',
            rel: 'canonical',
            href: `https://customfitcar.com/c/${params.category}/${params.handle}`,
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const categoryPage = await getVehicleCategoryPageData(
        params.category,
        params.handle,
    );

    if (!categoryPage) {
        throw new Response('Not Found', { status: 404 });
    }

    return { categoryPage };
}

export default function VehicleCategoryPage({ loaderData }: Route.ComponentProps) {
    const { categoryPage } = loaderData;
    const { category, vehiclePage, products } = categoryPage;

    const makeSlug = vehiclePage.make.toLowerCase().replace(/\s+/g, '-');
    const modelSlug = vehiclePage.model.toLowerCase().replace(/\s+/g, '-');

    return (
        <main style={{ padding: '32px' }}>
            <nav style={{ marginBottom: '24px' }}>
                <Link to={`/vehicle/${makeSlug}`}>{vehiclePage.make}</Link>
                {' / '}
                <Link to={`/vehicle/${makeSlug}/${modelSlug}`}>{vehiclePage.model}</Link>
                {' / '}
                <Link to={`/vehicle/${vehiclePage.handle}`}>All Accessories</Link>
            </nav>

            <h1>
                {category.name} for {vehiclePage.year} {vehiclePage.make} {vehiclePage.model}
            </h1>

            <p>
                Browse {category.name.toLowerCase()} options for the {vehiclePage.year}{' '}
                {vehiclePage.make} {vehiclePage.model}.
            </p>

            <section style={{ marginTop: '32px' }}>
                <h2>{category.name} Products</h2>

                {products.length > 0 ? (
                    <ul>
                        {products.map((product) => (
                            <li key={product.id}>
                                <Link to={product.href}>{product.title}</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found for this category.</p>
                )}
            </section>

            <section style={{ marginTop: '32px' }}>
                <Link to={`/vehicle/${vehiclePage.handle}`}>
                    ← Back to full vehicle accessories
                </Link>
            </section>
        </main>
    );
}