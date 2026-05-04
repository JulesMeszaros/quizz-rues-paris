import './MapComponent'
import './App.css'
import "leaflet/dist/leaflet.css";
import MapComponent from './MapComponent'
import StreetInput from './InputComponent'
import { getStreetIndex } from './logic/getStreetIndex'
import { useEffect, useState, useRef } from "react";

function App() {
  //Variable qui dit quand le jeu est pret (apres construction de l'index)
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(null);
  const [lastGuess, setLastGuess] = useState("");

  const mapRef = useRef(null);
  function handleStreetFound(feature) {
    console.log("✅ trouvé :", feature);
    
    mapRef.current.addStreet(feature);

    setLastGuess(feature.properties.l_longmin);
    setSuccess(true);
  }

  function handleStreetNotFound(name) {
    setLastGuess(name);
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
          {success === null ? "" : success ? `Ajouté : ${lastGuess}` : `Non trouvé : ${lastGuess}`}
        </div>

        <div id="map-container">
          <MapComponent ref={mapRef}/>
        </div>

        <div id="score-container">
          <h2>Avancement</h2>
        </div>
      </div>
    </>
  )
}}

export default App
