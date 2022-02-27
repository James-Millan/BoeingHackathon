import GeoJSON from "ol/format/GeoJSON";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { Fill, Style } from "ol/style";

const style = new Style({
  fill: new Fill({
    color: "#eeeeee"
  })
});

const vectorLayer = new VectorLayer({
  background: "#000075",
  source: new VectorSource({
    url: "https://openlayers.org/data/vector/ecoregions.json",
    format: new GeoJSON()
  }),
  style: function (feature) {
    const color = feature.get("COLOR_NNH") || "#eeeeee";
    style.getFill().setColor(color);
    return style;
  }
});

const map = new Map({
  layers: [vectorLayer],
  target: "map",
  view: new View({
    center: [0, 0],
    zoom: 1
  })
});
