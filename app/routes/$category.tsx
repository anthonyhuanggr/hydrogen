import { Link } from 'react-router';
import type { Route } from './+types/$category';
import { getCategoryBySlug } from '~/lib/categories';

export function meta({ data }: Route.MetaArgs) {
    if (!data?.category) {
        return [{ title: 'Category Not Found | CustomFitCar' }];
    }

    return [
        { title: data.category.title },
        { name: 'description', content: data.category.description },
        {
            tagName: 'link',
            rel: 'canonical',
            href: `https://customfitcar.com/${data.category.slug}`,
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const category = getCategoryBySlug(params.category);

    if (!category) {
        throw new Response('Not Found', { status: 404 });
    }

    return { category };
}

export default function CategoryPage({ loaderData }: Route.ComponentProps) {
    const { category } = loaderData;

    return (
        <main style={{ padding: '32px' }}>
            <h1>{category.name}</h1>
            <p>{category.description}</p>

            <section style={{ marginTop: '32px' }}>
                <h2>Popular vehicle pages</h2>
                <ul>
                    <li>
                        <Link to={`/${category.slug}/2021-mercedes-benz-gls-custom-fit-accessories`}>
                            2021 Mercedes-Benz GLS {category.name}
                        </Link>
                    </li>
                </ul>
            </section>
        </main>
    );
}