// Sauvegarder l'avancement
export function saveGame(ruesTrouvees, score, longueurTotale) {
  const gameState = {
    ruesTrouvees: Array.from(ruesTrouvees), // Convertir Set en Array
    score,
    longueurTotale,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Charger l'avancement
export function loadGame() {
  const saved = localStorage.getItem('gameState');
  if (!saved) return null;
  
  return JSON.parse(saved);
}

// Supprimer l'avancement
export function deleteGame() {
  localStorage.removeItem('gameState');
}