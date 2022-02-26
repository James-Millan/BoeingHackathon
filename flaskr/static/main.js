/*window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [0,0],
            zoom: 2,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map'
    })
   
    var coordinates = [[90,50], [-90, 10]]; 
    const lineString = new ol.geom.LineString(coordinates);
    lineString.transform('EPSG:4326', 'EPSG:3857');

    var layerLines = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: lineString,
                name: 'Line'
            })]
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'red',
              width: 3
            })
          })
    });

    
  
    map.addLayer(layerLines);

    console.log(coordinates);
    console.log(layerLines.geometry);
}
*/

