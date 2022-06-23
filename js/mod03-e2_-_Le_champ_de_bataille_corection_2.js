let characters = [];
let fighters = [];

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


function getCharacters(arr){
    let charList = "";
    for(const char of arr){
        const infoChar = {};
        infoChar.name=char.name;
        infoChar["img-xs"]=char.images.xs;
        infoChar["img-sm"]=char.images.sm;
        infoChar.stats={
            weapon:parseInt((char.powerstats.intelligence+char.powerstats.strength)/2),
            shield:char.powerstats.durability,
            combat:char.powerstats.combat,
            life:50
        }
        characters.push(infoChar);
        charList += "<div data-char='"+characters.indexOf(infoChar)+"'><img src='"+infoChar["img-xs"]+"' alt='"+infoChar.name+"'> " +infoChar.name+ " </div>";
    }
    document.getElementById("characters").innerHTML = charList;

    const charList2 = document.querySelectorAll(".characters div");
    
    for(const char of charList2){
        const stats = document.createElement("ul");
        let li = "";
        char.addEventListener("click", function(e){
            const index = this.dataset.char;
            fighters.push(characters[index]);
            console.log(characters[index]["img-sm"]);
            char.firstElementChild.src = characters[index]["img-sm"];
            const divCharStats = document.createElement("div");
            divCharStats.className = "char-stat";
            divCharStats.appendChild(this);
            document.getElementById("fighters").appendChild(divCharStats);
            // console.log(characters[index].stats);
            for(const s in characters[index].stats){
                li += "<li>"+s+" : "+characters[index].stats[s]+"</li>"
            }
            console.log(stats);
            stats.innerHTML += li;
            // document.getElementById("fighters").innerHTML += "<div>"+stats+"</div>";
            divCharStats.appendChild(stats);


            console.table(fighters);
        });
    }
}


function getRandomValue(max) {
    return parseInt(Math.random() * max);
}

// // Séléctionner aléatoirement un joueur
function getRandomChar(notThisOne) {
    const c = fighters[getRandomValue(fighters.length)];
    if (c !== notThisOne) return c;
    return getRandomChar(notThisOne);
}

// // Récupérer le score d'attaque d'un joueur
function getAttackScore(char) {
    return char.stats.weapon + getRandomValue(char.stats.combat);
}

// // Récupérer le score de défense d'un joueur
function getDefenseScore(char) {
    return char.stats.shield + getRandomValue(char.stats.combat);
}

// // Baisser les points de vie d'un joueur
function decreaseLife(char, value) {
    char.stats.life -= value;
    return char.stats.life;
}

// // Sortir un joueur mort du jeu
function buryTheDeads() {
    fighters = fighters.filter(char => char.stats.life > 0);
}

// // Faire s'affronter 2 joueurs
function fight(a, d) {
    const attackScore = getAttackScore(a);
    const defScore = getDefenseScore(d);
    console.log(`${a.name} avec une attaque de ${attackScore} fonce sur ${d.name} qui a une défense de ${defScore}.`);
    if (attackScore > defScore) {
        decreaseLife(d, attackScore-defScore);
        console.log(`${d.name} perd ${attackScore-defScore} points de vie, il lui en reste ${d.stats.life} !`); 
        buryTheDeads();
        return true;
    }
    console.log(`${d.name} résiste à l'attaque !`);
    return false;
}

function battle() {
    const attacker = getRandomChar();
    const defender = getRandomChar(attacker);
    
    fight(attacker, defender);
    
    for(const f of fighters){
        console.table(f.name+" PV restants : "+f.stats.life);
    }
    
    if (fighters.length <= 1) {
        console.table(fighters);
        console.log(`The winner is ${fighters[0].name}.`);
        return;
    }
    return; //battle();
}

document.getElementById("fight").addEventListener("click", battle);
