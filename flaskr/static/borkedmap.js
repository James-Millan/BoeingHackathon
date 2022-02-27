        $SCRIPT_ROOT = {{ request.script_root|tojson }};


    /**
    * Elements that make up the popup.
    */
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');
    const markerContainer = document.getElementById('markerPopup');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    const style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: "#eeeeee"
        })
    });

    const geoLayer = new ol.layer.Vector({
        background: "#000075",
        source: new ol.source.Vector({
            url: "https://openlayers.org/data/vector/ecoregions.json",
            format: new ol.format.GeoJSON()
        }),
        style: function (feature) {
            //climate = BIO
            //environment status = NNH
            //
            const color = feature.get("COLOR_BIO") || "#eeeeee";
            style.getFill().setColor(color);
            return style;
        }
    });

    const overlay = new ol.Overlay({
        element: container,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    });
    window.unload = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    const overlay2 = new ol.Overlay({
        element: markerContainer,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    });
    window.unload = function () {
        overlay2.setPosition(undefined);
        closer.blur();
        return false;
    };

    var map = new ol.Map({
        target: 'map',
        layers: [geoLayer,],
        overlays: [overlay, overlay2],
        target: 'map',
        view: new ol.View({
            center: ol.proj.fromLonLat([37.41, 8.82]),
            zoom: 2
        })
    });

    var getStyle = new ol.style.Style({
        image: new ol.style.Icon({
            scale: 1.3,
            anchor: [0.5, 1],
            src: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpaomedia%2Fsmall-n-flat%2F16%2Fmap-marker-icon.png&f=1&nofb=1'
        })
    })
    var markersStatic = new ol.layer.Vector({
        //type:Point,
        source: new ol.source.Vector(),
        style: function () { return getStyle; },
    });
    var markerDynamic = new ol.layer.Vector({
        //type:Point,
        source: new ol.source.Vector(),
        style: function () { return getStyle; },

    });
    map.addLayer(markersStatic);
    map.addLayer(markerDynamic);

    arrMarkers = [];
    var mydata = data;
    var coordinates = [];
    for (let i = 0; i <= mydata.length; i++) {
        try {
            marker = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([mydata[i].fields.geographical_coordinates[1], mydata[i].fields.geographical_coordinates[0]])) })
            marker.data = mydata[i].fields.name_en;
            arrMarkers.push(marker);
            markersStatic.getSource().addFeature(marker);
            coordinates.push([mydata[i].fields.geographical_coordinates[1], mydata[i].fields.geographical_coordinates[0]])
        } catch (error) {
            //ignore
        }
    }
    //var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([106.8478695, -6.1568562])));
    marker = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([106.8478695, -6.1568562])) })

    map.getView().on('propertychange', function (e) {
        switch (e.key) {
            case 'resolution':
                var getStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 1.8 * (Math.log(e.oldValue * 8) / Math.log(e.oldValue * 20)), //will go a bit crazy at extreme zoom
                        anchor: [0.5, 1],
                        src: 'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpaomedia%2Fsmall-n-flat%2F16%2Fmap-marker-icon.png&f=1&nofb=1'
                    })
                });
                break;
            }});
        map.addLayer(markers);

        var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([106.8478695, -6.1568562])));

        markers.getSource().addFeature(marker);

        map.on('click', function (evt) {
            console.info(evt.pixel);
            console.info(map.getPixelFromCoordinate(evt.coordinate));
            console.info(ol.proj.toLonLat(evt.coordinate));
            var coords = ol.proj.toLonLat(evt.coordinate);
            let lat = document.getElementById('lat');
            let long = document.getElementById('long');
            $(function(){
        		var lat = coords[0];
        		var long = coords[1];
        		$.ajax({
        			url: '/get',
        			data: {lat: lat, long: long},
        			type: 'POST',
        			success: function(response){
        				document.getElementById("content-text").innerHTML = response;
        			},
        			error: function(error){
        				console.log(error);
        			}
            	});
            });
            lat.setAttribute('value', coords[0]);
            long.setAttribute('value', coords[1]);
            var marker2 = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat(coords)));
            markers.getSource().addFeature(marker2);
        });

        const key = 'Get your own API key at https://www.maptiler.com/cloud/';
        const attributions =
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

        /**
         * Add a click handler to the map to render the popup.
         */
        map.on('singleclick', function (evt) {
          const coordinate = evt.coordinate;
          overlay.setPosition(coordinate);

        });

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    for (i = 0; i < arrMarkers.length; i++) {
        arrMarkers[i].on('singleclick', function (evt) {
            console.log(arrMarkers[i].name);
        }
        )
    }
    map.on('click', function (evt) {
        try {
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                    return feature;
                });
            if (feature) {
                var coordinates2 = feature.getGeometry().getCoordinates();
                console.log(typeof (coordinates2))
                console.log(typeof (coordinates2[0]))
                if (typeof (coordinates2) == 'object' && typeof (coordinates2[0]) == 'number') {
                    const coordinate = evt.coordinate;
                    overlay2.setPosition(coordinate);
                    document.getElementById('markerName').innerHTML = feature.data
                    console.log(feature.data);
                }
            }
            else {
                const coordinate = evt.coordinate;
                overlay.setPosition(coordinate);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
