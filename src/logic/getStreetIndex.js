let streetIndex = null;

function normalizeStreet(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // décompose les accents
    .replace(/[\u0300-\u036f]/g, ""); // supprime les diacritiques
}

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