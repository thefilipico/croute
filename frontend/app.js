const map = L.map('map').setView([45.815, 15.981], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
}).addTo(map);
//wow
document.getElementById('showRoute')?.addEventListener('click', async () => {
    const type = document.getElementById('type').value;
    const maxDistance = Number(document.getElementById('distance').value);
    const url = new URL("http://localhost:3000/route");
    url.searchParams.set("type", type);
    url.searchParams.set("maxDistance", maxDistance.toString());
    const res = await fetch(url.toString());
    const route = await res.json();
    map.eachLayer((layer) => { if (layer._path || layer._latlng)
        map.removeLayer(layer); });
    const latlngs = route.map(poi => [poi.lat, poi.lon]);
    L.polyline(latlngs, { color: 'blue' }).addTo(map);
    route.forEach(poi => {
        L.marker([poi.lat, poi.lon]).addTo(map).bindPopup(poi.name);
    });
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