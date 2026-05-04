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

  const mapRef = useRef(null);
  function handleStreetFound(feature) {
    console.log("✅ trouvé :", feature);
    
    mapRef.current.addStreet(feature);
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
        <StreetInput onStreetFound={handleStreetFound}/>
        <div id="input-container">
          
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
