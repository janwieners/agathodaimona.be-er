L.Map = L.Map.extend({
    openPopup: function(popup) {
        //        this.closePopup();  // just comment this
        this._popup = popup;

        return this.addLayer(popup).fire('popupopen', {
            popup: this._popup
        });
    }
});

var map = L.map('map').setView([36.617208,-121.9010943], 15);

var loveIcon = L.icon({
    iconUrl: 'img/heart.png',
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var boring = function(element) {


    if (clicks === 6) {

        // Add G&ouml;ttingen - and much love
        L.marker([36.617208,-121.9010943], {icon: loveIcon}).addTo(map)
            .bindPopup('<br>' +
            '<a href="kleio-bruehl.htm"><img style="width: 75px;" src="img/amedick.png" alt="Amedick"></a>' +
            '<br>' +
            ''
        );
    }
};

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([36.617208,-121.9010943]).addTo(map)
    .bindPopup('<img src="img/ricketts-lab_small.jpg" alt="Ricketts Lab">').openPopup();

L.marker([36.6043823,-121.8908846]).addTo(map)
    .bindPopup('<img src="img/western-flyer_small.jpg" alt="Western Flyer">').openPopup();

L.marker([36.6044991,-121.9159688]).addTo(map)
    .bindPopup('<img src="img/foertsch_small.jpg" alt="Reinhard Förtsch">').openPopup();

L.marker([36.6032244,-121.874813], {icon: loveIcon}).addTo(map)
    .bindPopup('<br>' +
    '<a href="holidays.htm"><img src="img/insel-ungezoomt_400px.jpg" alt="Urlaub!"></a>' +
    '<br>' +
    ''
);