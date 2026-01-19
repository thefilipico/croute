export interface POI {
    name: string;
    lat: number;
    lon: number;
    type: string;
    city: string;
}

export function haversineDistance(a: POI, b: POI): number {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);

    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);

    const aCalc = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));

    return R * c;
}

export function greedyRoute(start: POI, pois: POI[], maxDistance: number): POI[] {
    const route: POI[] = [start];
    const visited = new Set<string>();
    visited.add(start.name);

    let current = start;
    let totalDistance = 0;

    while (true) {
        let nearest: POI | null = null;
        let nearestDist = Infinity;

        for (const poi of pois) {
            if (visited.has(poi.name)) continue;
            const dist = haversineDistance(current, poi);
            if (dist < nearestDist) {
                nearest = poi;
                nearestDist = dist;
            }
        }

        if (!nearest || totalDistance + nearestDist > maxDistance) break;

        route.push(nearest);
        visited.add(nearest.name);
        totalDistance += nearestDist;
        current = nearest;
    }

    return route;
}
