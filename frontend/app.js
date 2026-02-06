const map = L.map('map').setView([45.815, 15.981], 7);
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);
//wow
document.getElementById('showRoute')?.addEventListener('click', async () => {
    const type = document.getElementById('type').value;
    const maxDistance = Number(document.getElementById('distance').value);
    const center = map.getCenter();

    const params = new URLSearchParams();
    params.set("type", type);
    params.set("maxDistance", maxDistance.toString());
    params.set("startLat", center.lat.toString());
    params.set("startLon", center.lng.toString());

    try {
        const res = await fetch(`/route?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) { alert(data.error || 'Server error'); return; }
        const route = data;

        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) return;
            map.removeLayer(layer);
        });

        if (!route || !route.length) { alert('No route found'); return; }

        const latlngs = route.map(poi => [poi.lat, poi.lon]);
        const poly = L.polyline(latlngs, { color: 'blue' }).addTo(map);
        route.forEach(poi => {
            L.marker([poi.lat, poi.lon]).addTo(map).bindPopup(poi.name);
        });
        map.fitBounds(poly.getBounds(), { padding: [20, 20] });
    } catch (err) {
        console.error(err);
        alert('Failed to fetch route');
    }
});



/*ph*/
const langSelect = document.getElementById('lang');
const typeSelect = document.getElementById('type');
const typeLabel = document.getElementById('type-label');
const distanceLabel = document.getElementById('distance-label');
const showRouteBtn = document.getElementById('showRoute');

langSelect.addEventListener('change', () => {
    const lang = langSelect.value;
    typeLabel.textContent = lang === 'en' ? 'Type:' : 'Tip:';
    distanceLabel.textContent = lang === 'en' ? 'Max km:' : 'Maks km:';
    showRouteBtn.textContent = lang === 'en' ? 'Show Route' : 'Prikaži Rutu';

    for (const option of typeSelect.options) {
        option.textContent = option.dataset[lang];
    }
});
