import type { Route } from './+types/vehicle.$slug';

export function meta({ params }: Route.MetaArgs) {
    return [{ title: `Vehicle ${params.slug} | CustomFitCar` }];
}

export async function loader({ params }: Route.LoaderArgs) {
    return { slug: params.slug };
}

export default function VehicleSlugPage({ loaderData }: Route.ComponentProps) {
    return (
        <main style={{ padding: '32px' }}>
            <h1>Vehicle Route Works ✅</h1>
            <p>slug: {loaderData.slug}</p>
        </main>
    );
}