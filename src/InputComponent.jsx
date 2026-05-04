import { useState } from "react";

export function normalizeStreetName(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // décompose les accents
    .replace(/[\u0300-\u036f]/g, ""); // supprime les diacritiques
}

export default function StreetInput() {
  const [value, setValue] = useState("");

  function handleValidate() {
    console.log("Rue entrée :", normalizeStreetName(value));
    setValue(""); // optionnel : reset après validation
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
        placeholder="Nom de rue..."
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