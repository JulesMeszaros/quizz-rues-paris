export default function normalizeStreetName(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // décompose les accents
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
    .replace(/[-''´`«»""]/g, " ") // remplace tirets, apostrophes, guillemets
    .replace(/[,;]/g, " ") // remplace virgules et points-virgules

    //Quelques abréviations pour simplifier les inputs au joueur
    .replace(/\bst\b/g, "saint")      // "st" → "saint"
    .replace(/\bste\b/g, "sainte")    // "ste" → "sainte"
    .replace(/\bave\b/g, "avenue")    // "ave" → "avenue" (optionnel)
    //Pour les différentes abréviations de boulevard
    .replace(/\bblv\b/g, "boulevard")    
    .replace(/\bbvd\b/g, "boulevard")    
    .replace(/\bblvd\b/g, "boulevard")   

    .replace(/\s+/g, " ") // normalise les espaces multiples en un seul
    .trim(); // enlève les espaces en début/fin
}