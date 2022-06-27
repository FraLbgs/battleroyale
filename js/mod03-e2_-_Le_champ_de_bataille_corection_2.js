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
        infoChar.img_xs=char.images.xs;
        infoChar.img_sm=char.images.sm;
        infoChar.stats={
            weapon:parseInt((char.powerstats.intelligence+char.powerstats.strength)/2),
            shield:char.powerstats.durability,
            combat:char.powerstats.combat,
            life:50
        }
        characters.push(infoChar);
        charList += "<a href='#' class='char-list' data-char='"+characters.indexOf(infoChar)+"'><img src='"+infoChar.img_xs+"' alt='"+infoChar.name+"'> " +infoChar.name+ " </a>";
    }
    document.getElementById("characters").innerHTML = charList;

    const charTab = document.getElementById("characters");
    charTab.addEventListener("click", function(e){
        if(e.target.className === "characters") return;
        const stats = document.createElement("ul");
        stats.className = "stats-list";
        let li = "";
        const cible = e.target.hasAttribute("data-char") ? e.target : e.target.parentElement;
        const index = cible.dataset.char;
        fighters.push(characters[index]);
        cible.firstElementChild.src = characters[index].img_sm;
        const divCharStats = document.createElement("div");
        divCharStats.className = "char-stat";
        divCharStats.appendChild(cible);
        for(const s in characters[index].stats){
            li += "<li>"+s+" : "+characters[index].stats[s]+"</li>"
        }
        stats.innerHTML += li;
        divCharStats.appendChild(stats);
        document.getElementById("fighters").appendChild(divCharStats);

        console.table(fighters);
    });

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
    return char.stats.weapon + getRandomValue(char.stats.combat+1);
}

// // Récupérer le score de défense d'un joueur
function getDefenseScore(char) {
    return char.stats.shield + getRandomValue(char.stats.combat+1);
}

// // Baisser les points de vie d'un joueur
function decreaseLife(char, value) {
    char.stats.life -= value;
    return char.stats.life;
}

// // Sortir un joueur mort du jeu
function buryTheDeads() {
    for(const fighter of fighters){
        if(fighter.stats.life<=0){
            console.log(fighter.stats.life);
            document.querySelector('[data-char="'+characters.indexOf(fighter)+'"]').parentElement.remove();
        }
    }
    fighters = fighters.filter(char => char.stats.life > 0);
}

// // Faire s'affronter 2 joueurs

function fight(a, d) {
    const attackScore = getAttackScore(a);
    const defScore = getDefenseScore(d);
   
    // document.getElementById('imgFightersAtt').src = a.img_sm;
    // document.getElementById('imgFightersDef').src = d.img_sm;
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
