const map = L.map('map').setView([45.815, 15.981], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);  

document.getElementById('showRoute')?.addEventListener('click', async () => {
    const type = (document.getElementById('type') as HTMLSelectElement).value;
    const maxDistance = Number((document.getElementById('distance') as HTMLInputElement).value);

    const url = new URL("http://localhost:3000/route");
    url.searchParams.set("type", type);
    url.searchParams.set("maxDistance", maxDistance.toString());
    if (startLat && startLon) {
        url.searchParams.set("startLat", startLat.toString)
        url.searchParams.set("startLon", startLon.toString)
    }
    const res = await fetch(url.toString());
    const route: POI[] = await res.json();

    let startLon : number | undefined;
    let startLat : number | undefined;

    const loc = getUserLocation();
    if (loc) {
        [startLat, startLon] = loc;
    }
    map.eachLayer((layer) => { if ((layer as any)._path || (layer as any)._latlng) map.removeLayer(layer); });

    const latlngs: [number, number][] = route.map(poi => [poi.lat, poi.lon]);
    L.polyline(latlngs, { color: 'blue' }).addTo(map);

    route.forEach(poi => {
        L.marker([poi.lat, poi.lon]).addTo(map).bindPopup(poi.name);
    });
});

async function getUserLocation(): Promise<[number, number] | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);

        navigator.geolocation.getCurrentPosition(
            (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
            () => resolve(null)
        );
    });
}
