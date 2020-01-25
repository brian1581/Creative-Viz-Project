var neighborhoodsURL = "https://opendata.arcgis.com/datasets/1ef75e34b8504ab9b14bef0c26cade2c_3.geojson"

function createMap(neighborhoodData, airbnbData,roomData) {

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

    var percents = {}
    roomData.forEach(room => {
        var hood = room.neighbourhood;
        var room_type = room.room_type;
        if (percents[hood]){
            percents[hood][room_type] = room.percent*100;
        } else {
            percents[hood] = {};
            // percents[hood]['Entire home/apt'] = 0;
            // percents[hood]['Private room'] = 0;
            // percents[hood]['Shared room'] = 0;
            // percents[hood]['Hotel room'] = 0;
            percents[hood][room_type] = room.percent*100;
            percents[hood]["lat"] = room.latitude;
            percents[hood]["long"] = room.longitude;
        };
    });
    
    var pieLayers = new L.LayerGroup();
    var pies = [];
    Object.entries(percents).forEach(([index,hood]) => {
        var rooms = []
        if (hood['Entire home/apt']) {
            rooms.push({num: hood['Entire home/apt'], label: "Entire home/apt"})
        } 
        if (hood["Private room"]) {
            rooms.push({num: hood["Private room"], label: "Private room"})
        }
        if (hood['Shared room']) {
            rooms.push({num: hood['Shared room'], label: "Shared room"})
        }
        if (hood["Hotel room"]) {
            rooms.push({num: hood["Hotel room"], label: "Hotel room"})
        }
        var new_pie = L.pie([hood['lat'],hood['long']], rooms).bindPopup(`${index}`);
    pies.push([index,new_pie]);
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    
    options = ''
    pies.forEach(pie =>{
        options += `<option id="pie-option" value=${pie[0].replace(" ","_")}>${pie[0]}</option>`;
        // pieLayers.addLayer(pie[0])
    });
    

    var legend = L.control({position: 'topright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<select><option value="none">Select A Neighbourhood</option>'+options+'</select>';
        div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;
    };
    legend.addTo(map);
    
    map.addLayer(airbnbListings);
    // pies.forEach(pie => map.addLayer(pie[1]));
    
    var current_pie = ''
    d3.select("select").on("change",function(event) {
        var selected = d3.select(this)
            // .select("#pie-option")
            .property("value");
        
        console.log(selected);
        pies.forEach(pie => {
            // map.clearLayers();
            
            if (pie[0].replace(" ","_") === selected) {
                map.addLayer(pie[1]);
            }
            if (pie[0].replace(" ","_") === current_pie) {
                map.removeLayer(pie[1]);
            }
            // if (selected !== "none") {
                
            // }
            current_pie = selected;
            // console.log(layers);
        })
        map.removeLayer(pies)
    })
    map.on("layeradd", function(e) {
        // Handle only marker layers
        current_pie = e.layer.options.value;
        // console.log(e.layer.options.value);
        if((e.layer.options.id != "markerLayer1") && (e.layer.options.id != "markerLayer2")) {
        return;
      }
    
      // For the currently added layer (which is one with markers)
      // get all its layers
      var markers = e.layer.getLayers();
    

      
      
    });

    
    
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
        d3.json("/data/airbnb_rooms", function(roomData) {
        
            createFeatures(neighborhoodData);
        
            createMap(neighborhoodData,airbnbData,roomData);
        })
    })
        
})