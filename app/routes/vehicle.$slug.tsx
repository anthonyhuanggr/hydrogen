import { Link } from 'react-router';
import type { Route } from './+types/vehicle.$slug';
import { getCategoryBySlug } from '~/lib/categories';
import { getVehicleOrMakePageData } from '~/lib/vehicle-pages';

function modelToSlug(model: string) {
    return model.toLowerCase().replace(/\s+/g, '-');
}

export function meta({ data, params }: Route.MetaArgs) {
    if (!data?.resolvedPage) {
        return [{ title: 'Vehicle Page Not Found | CustomFitCar' }];
    }

    if (data.resolvedPage.pageType === 'make') {
        return [
            { title: `${data.resolvedPage.data.title} | CustomFitCar` },
            { name: 'description', content: data.resolvedPage.data.description },
            {
                tagName: 'link',
                rel: 'canonical',
                href: `https://customfitcar.com/vehicle/${params.slug}`,
            },
        ];
    }

    return [
        { title: `${data.resolvedPage.data.title} | CustomFitCar` },
        { name: 'description', content: data.resolvedPage.data.description },
        {
            tagName: 'link',
            rel: 'canonical',
            href: `https://customfitcar.com/vehicle/${params.slug}`,
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const resolvedPage = await getVehicleOrMakePageData(params.slug);

    if (!resolvedPage) {
        throw new Response('Not Found', { status: 404 });
    }

    return { resolvedPage };
}

export default function VehicleSlugPage({ loaderData }: Route.ComponentProps) {
    const { resolvedPage } = loaderData;

    if (resolvedPage.pageType === 'make') {
        const makePage = resolvedPage.data;

        return (
            <main style={{ padding: '32px' }}>
                <h1>{makePage.title}</h1>
                <p>{makePage.description}</p>

                <section style={{ marginTop: '32px' }}>
                    <h2>Shop by Model</h2>
                    <ul>
                        {makePage.models.map((model) => (
                            <li key={model}>
                                <Link to={`/vehicle/${makePage.makeSlug}/${modelToSlug(model)}`}>
                                    {model}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section style={{ marginTop: '32px' }}>
                    <h2>Featured Vehicle Pages</h2>
                    <ul>
                        {makePage.featuredVehicles.map((vehicle) => (
                            <li key={vehicle.handle}>
                                <Link to={`/vehicle/${vehicle.handle}`}>{vehicle.title}</Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        );
    }

    const vehiclePage = resolvedPage.data;
    const makeSlug = vehiclePage.make.toLowerCase().replace(/\s+/g, '-');
    const modelSlug = vehiclePage.model.toLowerCase().replace(/\s+/g, '-');

    return (
        <main style={{ padding: '32px' }}>
            <nav style={{ marginBottom: '24px' }}>
                <Link to={`/vehicle/${makeSlug}`}>{vehiclePage.make}</Link>
                {' / '}
                <Link to={`/vehicle/${makeSlug}/${modelSlug}`}>{vehiclePage.model}</Link>
            </nav>

            <h1>{vehiclePage.title}</h1>
            <p>{vehiclePage.description}</p>

            <section style={{ marginTop: '32px' }}>
                <h2>Shop by Category</h2>
                <ul>
                    {vehiclePage.categories.map((slug) => {
                        const category = getCategoryBySlug(slug);
                        if (!category) return null;

                        return (
                            <li key={slug}>
                                <Link to={`/c/${slug}/${vehiclePage.handle}`}>
                                    {category.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section style={{ marginTop: '32px' }}>
                <h2>Featured Products</h2>
                {vehiclePage.categories.map((slug) => {
                    const category = getCategoryBySlug(slug);
                    const products = vehiclePage.featuredProductsByCategory[slug] ?? [];

                    if (!category || products.length === 0) return null;

                    return (
                        <div key={slug} style={{ marginBottom: '24px' }}>
                            <h3>{category.name}</h3>
                            <ul>
                                {products.map((product) => (
                                    <li key={product.id}>
                                        <Link to={product.href}>{product.title}</Link>
                                    </li>
                                ))}
                            </ul>
                            <Link to={`/c/${slug}/${vehiclePage.handle}`}>
                                View all {category.name.toLowerCase()} for this vehicle
                            </Link>
                        </div>
                    );
                })}
            </section>
        </main>
    );
}