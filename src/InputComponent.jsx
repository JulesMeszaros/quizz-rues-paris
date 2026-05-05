import { useState } from "react";
import { getStreetIndex } from "./logic/getStreetIndex";

function normalizeStreetName(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // décompose les accents
    .replace(/[\u0300-\u036f]/g, ""); // supprime les diacritiques
}

export default function StreetInput({ onStreetNotFound, onStreetFound }) {
  const [value, setValue] = useState("");

  async function handleValidate() {
    console.log("Rue entrée :", normalizeStreetName(value));
    setValue(""); // optionnel : reset après validation

    const index = await getStreetIndex(); // 👈 récupère l'index (construit une fois)

    const key = normalizeStreetName(value);
    const feature = index.get(key);

    if (feature) {
        //Déclenche la fonction dans le component App
        onStreetFound(feature);
    } else {
        console.log("❌ pas trouvé");
        onStreetNotFound(normalizeStreetName(value))
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleValidate();
    }
  }

  return (
    <div>
      <input
        type="text"
        value={value}
        placeholder="Rue des beaux arts"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleValidate}
      >
        Valider
      </button>
    </div>
  );
}