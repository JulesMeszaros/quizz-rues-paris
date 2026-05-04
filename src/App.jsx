import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './MapComponent'
import './App.css'
import "leaflet/dist/leaflet.css";
import MapComponent from './MapComponent'
import StreetInput from './InputComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <h1>Quizz des rues de paris</h1>
        <StreetInput />
        <div id="input-container">
          
        </div>

        <div id="map-container">
          <MapComponent />
        </div>

        <div id="score-container">
          <h2>Avancement</h2>
        </div>
      </div>
    </>
  )
}

export default App
