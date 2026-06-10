document.addEventListener('DOMContentLoaded', function () {

    // ── Map setup ─────────────────────────────────────────────────────────────
    const map = L.map('talkmap', {
        minZoom: 2,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0
    }).setView([30, 10], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 18
    }).addTo(map);

    // ── Icons ─────────────────────────────────────────────────────────────────
    const blueIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
    });
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
    });
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
    });

    function iconForCategory(cat) {
        if (cat === 'ml')   return blueIcon;
        if (cat === 'math') return greenIcon;
        return redIcon;
    }

    // ── Legend ────────────────────────────────────────────────────────────────
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML =
            '<i style="color:red">&#9679;</i> String Theory<br>' +
            '<i style="color:blue">&#9679;</i> Machine Learning<br>' +
            '<i style="color:green">&#9679;</i> Mathematics';
        return div;
    };
    legend.addTo(map);

    // ── Load data and render ──────────────────────────────────────────────────
    // talksData is provided by talks.js (loaded as a <script> tag before this
    // file), which works with both file:// and http://.
    Promise.resolve(talksData)
        .then(function (talks) {

            // Populate year picker
            const years = Array.from(new Set(talks.map(function (t) { return t.year; })))
                               .sort(function (a, b) { return b - a; });
            const select = document.getElementById('yearFilter');
            years.forEach(function (y) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                select.appendChild(opt);
            });

            // Cluster group (recreated on filter change)
            let clusterGroup = L.markerClusterGroup();
            map.addLayer(clusterGroup);

            function render(year) {
                clusterGroup.clearLayers();

                const filtered = (year === 'all')
                    ? talks
                    : talks.filter(function (t) { return String(t.year) === String(year); });

                const mapped = filtered.filter(function (t) { return t.lat !== null && t.lng !== null; });

                mapped.forEach(function (t) {
                    const marker = L.marker([t.lat, t.lng], { icon: iconForCategory(t.category) });
                    marker.bindPopup(
                        '<b>' + t.title + '</b><br>' +
                        t.venue + ' (' + t.year + ')'
                    );
                    clusterGroup.addLayer(marker);
                });

                const skipped = filtered.length - mapped.length;
                const statsEl = document.getElementById('talk-stats');
                statsEl.textContent =
                    'Showing ' + mapped.length + ' of ' + filtered.length + ' talks' +
                    (skipped > 0 ? ' (' + skipped + ' virtual/unmapped not shown)' : '');
            }

            render('all');

            select.addEventListener('change', function () {
                render(this.value);
            });
        })
        .catch(function (err) {
            document.getElementById('talk-stats').textContent =
                'Could not load talk data: ' + err.message;
        }); // note: Promise.resolve() never rejects, but kept for safety
});
