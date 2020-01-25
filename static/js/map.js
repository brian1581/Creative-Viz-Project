var neighborhoodsURL = "https://opendata.arcgis.com/datasets/1ef75e34b8504ab9b14bef0c26cade2c_3.geojson"

function createMap(neighborhoodData, airbnbData) {

    var neighborhoods = createFeatures(neighborhoodData);
    var airbnbListings = createClusters(airbnbData);

    var streetMap = L.tileLayer(MAPBOX_URL, {
        attribution: ATTRIBUTION,
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var map = L.map("map", {
        center: [45.52, -122.67],
        zoom: 11,
        layers: [streetMap, neighborhoods, airbnbListings]
    });

    var baseMaps = {
        "Street Map": streetMap
    }

    var overlayMaps = {
        "Neighborhood Boundaries": neighborhoods,
        "Airbnb Listings": airbnbListings
    }

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    
    map.addLayer(airbnbListings);
}


function createFeatures(neighborhoodData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.MAPLABEL}</h3>`)
    };

        var neighborhoods = L.geoJSON(neighborhoodData, {
            style: {fillOpacity: 0},
            onEachFeature: onEachFeature
        });

        return neighborhoods;
}

function createClusters(airbnbData) {

    var markers = L.markerClusterGroup();
    
    airbnbData.forEach(listing => {
        markers.addLayer(L.marker([listing.latitude, listing.longitude]))
        .bindPopup(`${listing.name}<hr>
        <strong>Price:</strong> $${listing.price}
        <br><strong>Romm Type:</strong> ${listing.room_type}`)
    })
    
    return markers;
}

d3.json(neighborhoodsURL, function (neighborhoodData) {
    d3.json("/data/airbnb", function(airbnbData) {
        // d3.json("/data/airbnb_rooms")
        // console.log(neighborhoodData);
        createFeatures(neighborhoodData);
        // console.log(airbnbData);
        
        createMap(neighborhoodData,airbnbData);
    })
        
})