import { useState } from "react";
import { getStreetIndex } from "./utils/getStreetIndex";
import normalizeStreet from "./utils/normalizeStreetName";


export default function StreetInput({ onStreetNotFound, onStreetFound }) {
  const [value, setValue] = useState("");

  async function handleValidate() {
    console.log("Rue entrée :", normalizeStreet(value));
    setValue(""); // optionnel : reset après validation

    const index = await getStreetIndex(); // 👈 récupère l'index (construit une fois)

    const key = normalizeStreet(value);
    const feature = index.get(key);

    if (feature) {
        //Déclenche la fonction dans le component App
        onStreetFound(feature);
    } else {
        console.log("❌ pas trouvé");
        onStreetNotFound(value)
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