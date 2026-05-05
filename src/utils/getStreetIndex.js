import normalizeStreet from "./normalizeStreetName";

let streetIndex = null;


export async function getStreetIndex() {
  if (streetIndex) return streetIndex;

  const res = await fetch("/denominations-emprises-voies-actuelles.geojson");
  const geoData = await res.json();

  streetIndex = new Map();

  geoData.features.forEach((feature) => {
    const name = feature.properties.typo_min;
    if (!name) return;

    streetIndex.set(normalizeStreet(name), feature);
  });

  return streetIndex;
}