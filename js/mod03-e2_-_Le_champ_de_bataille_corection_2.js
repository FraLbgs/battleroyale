let characters = [];

try{
    fetch("https://akabab.github.io/superhero-api/api/all.json")
    .then(response => response.json())
    .then(json => getCharacters(json));
}
catch (error) {
    console.error("error" + error);
}

// let publisher = []
// function getPublisher(arr){
//     for(const char of arr){
//         publisher.push(char.biography.publisher);
//     }
//     // console.log(publisher.sort());
//     publisher.sort()
//     publisher = publisher.filter((pub, i) => publisher.indexOf(pub) == i);
//     console.log(publisher);
// }

let charList = "";

function getCharacters(arr){
    for(const char of arr){
        characters.push(char.name);
    }
    characters.sort();
    const infoChar = {};
    for(const char of arr){
        infoChar.name=char.name;
        infoChar.img=char.images.xs;
        infoChar.stats={
            weapon:parseInt((char.powerstats.intelligence+char.powerstats.strength)/2),
            shield:char.powerstats.durability,
            combat:char.powerstats.combat,
            life:100
        }
        charList += "<div><img src='"+infoChar.img+"' alt='"+infoChar.name+"'> " +infoChar.name+ " </div>";
    }
    document.getElementById("characters").innerHTML = charList;
}







//  let characters = [
//     {
//         name: "King Kong",
//         life: 50,
//         xp: 6,
//         weapon: 5,
//         shield: 2
//     },
//     {
//         name: "Josephine AG",
//         life: 50,
//         xp: 8,
//         weapon: 1,
//         shield: 2
//     },
//     {
//         name: "Naruto",
//         life: 50,
//         xp: 3,
//         weapon: 8,
//         shield: 3
//     },
//     {
//         name: "Spiderman",
//         life: 50,
//         xp: 7,
//         weapon: 5,
//         shield: 5
//     },
// ];



// function getRandomValue(max) {
//     return parseInt(Math.random()*max);
// }

// // Séléctionner aléatoirement un joueur
// function getRandomChar(notThisOne) {
//     const c = characters[getRandomValue(characters.length)];
//     if (c !== notThisOne) return c;
//     return getRandomChar(notThisOne);
// }

// // Récupérer le score d'attaque d'un joueur
// function getAttackScore(char) {
//     return char.xp + getRandomValue(char.weapon);
// }

// // Récupérer le score de défense d'un joueur
// function getDefenseScore(char) {
//     return char.xp + getRandomValue(char.shield);
// }

// // Baisser les points de vie d'un joueur
// function decreaseLife(char, value) {
//     char.life -= value;
//     return char.life;
// }

// // Sortir un joueur mort du jeu
// function buryTheDeads() {
//     characters = characters.filter(char => char.life > 0);
// }

// // Faire s'affronter 2 joueurs
// function fight(a, d) {
//     const attackScore = getAttackScore(a);
//     if (attackScore > getDefenseScore(d)) {
//         decreaseLife(d, attackScore);
//         buryTheDeads();
//         return true;
//     }
//     return false;
// }

// function battle() {
//     const attacker = getRandomChar();
//     const defender = getRandomChar(attacker);
//     console.log(`${attacker.name} is attacking ${defender.name}.`);
    
//     const resultText = fight(attacker, defender) ? "win" : "lose";
//     console.log(`${attacker.name} ${resultText}.`);
    
//     console.table(characters);
    
//     if (characters.length <= 1) {
//         console.table(characters);
//         console.log(`The winner is ${characters[0].name}.`);
//         return;
//     }
//     return battle();
// }

// battle();

// // console.log(attacker, defender);