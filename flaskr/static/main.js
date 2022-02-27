let style = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "#eeeeee"
  })
});

const element = document.getElementById("popup");
var geoLayer = new ol.layer.Vector({
  background: "#0066cc",
  source: new ol.source.Vector({
    url: "https://openlayers.org/data/vector/ecoregions.json",
    format: new ol.format.GeoJSON()
  }),
  //selects each polygon from the GeoJSON and fills it with the relevant colour
  style: function (feature) {
    const color =
      feature.get("COLOR" + document.getElementById("mapType").value) ||
      "#eeeeee";
    style.getFill().setColor(color);
    return style;
  }
});

var map = new ol.Map({
  layers: [geoLayer],
  target: "map",
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

// popup overlay for longitude and latitude
const popup = new ol.Overlay({
  element: element,
  positioning: "bottom-center",
  stopEvent: false
});
map.addOverlay(popup);

// white outline to contrast black text
const outlineStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "rgba(255, 255, 255, 1)",
    width: 1
  })
});

// layer for outlines
const locationLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: outlineStyle
});

//mouse popup tracker
let outline;
map.on("pointermove", function (evt) {
  if (evt.dragging) {
    return;
  }
  geoLayer.getFeatures(evt.pixel).then(function (features) {
    // functionally an if else statement with the syntax
    // feature = features[0] if features.length, else undefined
    const feature = features.length ? features[0] : undefined;
    if (feature) {
      popup.setPosition(evt.coordinate);
      // popover jquery
      $(element).popover({
        placement: "top",
        html: true,
        //gets value from GeoJSON
        content: feature.get(document.getElementById("dataType").value)
      });
      $(element).popover("show");
    }
    // refreshes popup every 300 ticks
    setTimeout(function () {
      $(element).popover("dispose");
    }, 300);
    //outlines hovered over regions
    if (feature !== outline) {
      if (feature) {
        locationLayer.getSource().addFeature(feature);
      }
      if (outline) {
        locationLayer.getSource().removeFeature(outline);
      }

      outline = feature;
    }
  });

  //displays requested data after clicking
  map.on("click", function (evt) {
    // removes previous elemnt after click
    $(element).popover("dispose");
    const info = function (pixel) {
      geoLayer.getFeatures(pixel).then(function (features) {
        // functionally an if else statement with the syntax
        // feature = features[0] if features.length, else undefined
        const feature = features.length ? features[0] : undefined;
        // displays information beneath map
        const info = document.getElementById("info");
        if (feature) {
          info.innerHTML =
            // name of ecological region
            feature.get("ECO_NAME") +
            ", " +
            // name of biome
            feature.get("BIOME_NAME") +
            ", " +
            //name of zoographical realm
            feature.get("REALM") +
            " realm: " +
            //nature needs half classification
            feature.get("NNH_NAME");
          popup.setPosition(evt.coordinate);
          $(element).popover({
            placement: "top",
            html: true,
            content: feature.get(document.getElementById("dataType").value)
          });
          $(element).popover("show");
        } else {
          info.innerHTML = "&nbsp;";
        }
      });
    };
    info(map.getEventPixel(evt.originalEvent));
  });
});