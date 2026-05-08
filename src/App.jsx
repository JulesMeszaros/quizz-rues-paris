/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import './MapComponent'
import './App.css'
import "leaflet/dist/leaflet.css";
import MapComponent from './MapComponent'
import StreetInput from './InputComponent'
import { getStreetIndex } from './utils/getStreetIndex'
import { useEffect, useState, useRef } from "react";
import normalizeStreet from './utils/normalizeStreetName';
import { saveGame, loadGame, deleteGame } from './utils/saveManager';

function App() {
  //Variable qui dit quand le jeu est pret (apres construction de l'index)
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(null);
  const [lastGuess, setLastGuess] = useState("");
  const [ruesTrouvees, setRuesTrouvees] = useState([]);
  const [score, setScore] = useState(0);
  const [longueurTotale, setLongueurTotale] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  //Etat pour le chargement de la save
  const [saveLoaded, setSaveLoaded] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  //Refs pour la carte
  const mapRef = useRef(null);
  const layerRef = useRef(null);


  //Fonction déclenchée lorsqu'une rue est trouvée ou retrouvée
  function handleStreetFound(feature) {
    // Vérifier si la rue a déjà été trouvée
    if (ruesTrouvees.some(rue => rue.properties.typo_min === feature.properties.typo_min)) {
      // Rue déjà trouvée
      setLastGuess(feature.properties.typo_min);
      setSuccess(false);
      setSuccessMessage(`Déjà trouvée : ${feature.properties.typo_min}`);
      return;
    }

    // Sinon, continuer normalement
    mapRef.current.addStreet(feature);
    setLastGuess(feature.properties.typo_min);
    setSuccess(true);
    setSuccessMessage(`Ajouté : ${feature.properties.typo_min}, ${feature.properties.longueur}m (${feature.properties.arrdt} arrondissement(s))`);

    console.log(ruesTrouvees)

    setRuesTrouvees((prev) => [...prev, feature]);
    setLongueurTotale(longueurTotale + feature.properties.longueur);
    setScore((prev) => prev + 1);
  }

  function handleStreetNotFound(name) {
    setLastGuess(name);
    setSuccessMessage(`Introuvable : ${name}`);
    setSuccess(false);
  }

  //Au lancement de la partie
  useEffect(() => {
    async function init() {
      //Creation de l'index des rues
      const index = await getStreetIndex(); // 👈 construit UNE FOIS

      //Récup la save locale
      const gameSave = loadGame()

      //On remet les variables d'état avec les valeurs de la save
      if (gameSave) {
        setLongueurTotale(gameSave.longueurTotale)
        setScore(gameSave.score)
        setRuesTrouvees(gameSave.ruesTrouvees)
        setSaveLoaded(true)
      }


      setReady(true);
    }
    init();
  }, []);

  //Fonction qui se déclenche quand la carte est chargée et que la save est chargée
  useEffect(() => {

    if (!saveLoaded || !mapReady) return; // Attendre les 2

    ruesTrouvees.forEach(feature => {
      mapRef.current.addStreet(feature);
    });

  }, [saveLoaded, mapReady])

  const handleMapReady = (layerReady) => {
    setMapReady(layerReady); // Passer layerReady depuis MapComponent
  };

  //Fonction qui enregistre la partie dans la session quand une nouvelle rue est trouvée
  useEffect(() => {
    if (ready == true) {
      console.log("saving game")
      saveGame(ruesTrouvees, score, longueurTotale)
    }
  }, [ruesTrouvees, score, longueurTotale, ready]);

  //Fonction pour reset la partie
  const resetGame = () => {
    setLongueurTotale(0)
    setLastGuess("")
    setRuesTrouvees([])
    setScore(0)
    setSuccess(false)
    setSuccessMessage("")
    mapRef.current.resetMap()
  }

  if (!ready) {

    return <div>Chargement des rues...</div>;

  } else {
    return (
      <>
        <div className="App">
          <h1>Paris</h1>
          <StreetInput onStreetNotFound={handleStreetNotFound} onStreetFound={handleStreetFound} />

          <div id="last-guess" className={success === null ? "" : success ? "success" : "failure"}>
            {successMessage}
          </div>

          <div id="map-container">
            <MapComponent ref={mapRef} onMapReady={handleMapReady} />
          </div>

          <div id="score-container">
            <h2>Avancement</h2>
            <h3>Longueur totale trouvée : {longueurTotale}m</h3>
            <h3>{score} / 6594</h3>
          </div>

          <button onClick={resetGame}>Supprimer l'avancement</button>
        </div>
      </>
    )
  }
}

export default App
