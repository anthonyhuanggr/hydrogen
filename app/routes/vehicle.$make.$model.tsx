import { Link } from 'react-router';
import type { Route } from './+types/vehicle.$make.$model';
import { getCategoryBySlug } from '~/lib/categories';
import { getMakeModelPageData } from '~/lib/vehicle-pages';

export function meta({ data, params }: Route.MetaArgs) {
    if (!data?.makeModelPage) {
        return [{ title: 'Vehicle Model Not Found | CustomFitCar' }];
    }

    return [
        { title: `${data.makeModelPage.title} | CustomFitCar` },
        { name: 'description', content: data.makeModelPage.description },
        {
            tagName: 'link',
            rel: 'canonical',
            href: `https://customfitcar.com/vehicle/${params.make}/${params.model}`,
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const makeModelPage = await getMakeModelPageData(params.make, params.model);

    if (!makeModelPage) {
        throw new Response('Not Found', { status: 404 });
    }

    return { makeModelPage };
}

export default function VehicleMakeModelPage({ loaderData }: Route.ComponentProps) {
    const { makeModelPage } = loaderData;

    return (
        <main style={{ padding: '32px' }}>
            <nav style={{ marginBottom: '24px' }}>
                <Link to={`/vehicle/${makeModelPage.makeSlug}`}>{makeModelPage.make}</Link>
            </nav>

            <h1>{makeModelPage.title}</h1>
            <p>{makeModelPage.description}</p>

            <section style={{ marginTop: '32px' }}>
                <h2>Shop by Year</h2>
                <ul>
                    {makeModelPage.vehicles.map((vehicle) => (
                        <li key={vehicle.handle}>
                            <Link to={`/vehicle/${vehicle.handle}`}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={{ marginTop: '32px' }}>
                <h2>Available Categories</h2>
                <ul>
                    {makeModelPage.categories.map((slug) => {
                        const category = getCategoryBySlug(slug);
                        if (!category) return null;

                        return <li key={slug}>{category.name}</li>;
                    })}
                </ul>
            </section>
        </main>
    );
}