var neighborhoodsURL = "https://opendata.arcgis.com/datasets/9f50a605cf4945259b983fa35c993fe9_125.geojson"

function createMap(neighborhoods) {

    var streetMap = L.tileLayer(MAPBOX_URL, {
        attribution: ATTRIBUTION,
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var map = L.map("map", {
        center: [45.52, -122.67],
        zoom: 11,
        layers: [streetMap, neighborhoods]
    });
}


function createFeatures(neighborhoodData) {

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: function (event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity: 0
                });
            },
            mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity: 0
                });
            }
        }).bindPopup(`<h3>${feature.properties.MAPLABEL}</h3>`)
    };

        var neighborhoods = L.geoJSON(neighborhoodData, {
            onEachFeature: onEachFeature
        });

        createMap(neighborhoods);
    }

    d3.json(neighborhoodsURL, function (neighborhoodData) {
        console.log(neighborhoodData);
        createFeatures(neighborhoodData);
    })