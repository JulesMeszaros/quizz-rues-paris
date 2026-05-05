/* eslint-disable no-unused-vars */

import './MapComponent'
import './App.css'
import "leaflet/dist/leaflet.css";
import MapComponent from './MapComponent'
import StreetInput from './InputComponent'
import { getStreetIndex } from './utils/getStreetIndex'
import { useEffect, useState, useRef } from "react";
import normalizeStreet from './utils/normalizeStreetName';

function App() {
  //Variable qui dit quand le jeu est pret (apres construction de l'index)
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(null);
  const [lastGuess, setLastGuess] = useState("");
  const [ruesTrouvees, setRuesTrouvees] = useState([]);
  const [score, setScore] = useState(0);
  const [longueurTotale, setLongueurTotale] = useState(0);
  const [successMessage, setSuccessMessage] = useState("")

  const mapRef = useRef(null);
function handleStreetFound(feature) {
  // Vérifier si la rue a déjà été trouvée
  if (ruesTrouvees.includes(feature.properties.typo_min)) {
    // Rue déjà trouvée !
    setLastGuess(feature.properties.typo_min);
    setSuccess(false);  // ← Pas de succès, erreur
    setSuccessMessage(`Déjà trouvée : ${feature.properties.typo_min}`);

    return;  // ← Important : arrêter ici
  }

  // Sinon, continuer normalement
  mapRef.current.addStreet(feature);
  setLastGuess(feature.properties.typo_min);
  setSuccess(true);
  setSuccessMessage(`Ajouté : ${feature.properties.typo_min}`);

  setRuesTrouvees((prev) => [...prev, feature.properties.typo_min]);
  setLongueurTotale(longueurTotale + feature.properties.longueur);
  setScore((prev) => prev + 1);
}

  function handleStreetNotFound(name) {
    setLastGuess(name);
    setSuccessMessage(`Introuvable : ${name}`);
    setSuccess(false);
  }

  useEffect(() => {
    async function init() {
      const index = await getStreetIndex(); // 👈 construit UNE FOIS
      setReady(true);
      console.log(index)
    }
    init();
  }, []);
  if (!ready) {

    return <div>Chargement des rues...</div>;

  }else{
  return (
    <>
      <div className="App">
        <h1>Quizz des rues de paris</h1>
        <StreetInput onStreetNotFound={handleStreetNotFound} onStreetFound={handleStreetFound}/>

        <div id="last-guess" className={success === null ? "" : success ? "success" : "failure"}>
          {successMessage}
        </div>

        <div id="map-container">
          <MapComponent ref={mapRef}/>
        </div>

        <div id="score-container">
          <h2>Avancement</h2>
          <h3>Longueur totale trouvée : {longueurTotale}m</h3>
          <h3>{score} / 6594</h3>
        </div>
      </div>
    </>
  )
}}

export default App
