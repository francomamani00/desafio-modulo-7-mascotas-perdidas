import * as mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY;
const mapboxClient = new MapboxClient(MAPBOX_API_KEY);
mapboxgl.accesToken = MAPBOX_API_KEY;
export async function initMap(mapElement, lat, lng) {
  return await new mapboxgl.Map({
    container: mapElement,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lng, lat],
    zoom: 14,
  });
}
export async function initSearchForm(mapboxInput, callback) {
  await mapboxClient.geocodeForward(
    mapboxInput,
    {
      country: "ar",
      autocomplete: true,
      language: "es",
    },
    function (err, data, res) {
      if (!err) callback(data.features);
    }
  );
}
