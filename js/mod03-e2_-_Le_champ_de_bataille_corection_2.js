let characters = [];
let fighters = [];
let alignment = []
let details =document.getElementById("details") ;

try{
    fetch("https://akabab.github.io/superhero-api/api/all.json")
    .then(response => response.json())
    .then(function (json){
        getCharacters(json);
        getAlignment(json);
    }) 
}
catch (error) {
    console.error("error" + error);
}

function getAlignment(arr){
    for(const char of arr){
        alignment.push(char.biography.alignment);
    }
    console.log(alignment);
    // alignment.sort()
    alignment = alignment.filter((pub, i) => alignment.indexOf(pub) == i);
    console.log(alignment);
}


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
        charList += "<a href='#' title='Weapon : "+infoChar.stats.weapon+
        "\nShield : "+infoChar.stats.shield+
        "\nCombat : "+infoChar.stats.combat+
        "\nLife : "+infoChar.stats.life+
        "' class='char-list' data-char='"+characters.indexOf(infoChar)+
        "'><img src='"+infoChar.img_xs+"' alt='"+infoChar.name+"'> " +infoChar.name+ " </a>";
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
        const keys = Object.keys(characters[index].stats);
        const values = Object.values(characters[index].stats);
        console.log(keys, values);
        for(let i=0;i<3;i++){
            li += "<li>"+keys[i]+" : "+values[i]+"</li>"
        }
        li += "<li>"+keys[3]+" : <meter class='pv' max='50' low='20' value="+values[3]+"></meter></li>"
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
    const life = document.querySelector('[data-char="'+characters.indexOf(char)+'"] + ul li:last-child');
    life.innerHTML = "life : <meter class='pv' max='50' low='20' value="+char.stats.life+"></meter>";
    return char.stats.life;
}

// // Sortir un joueur mort du jeu
function buryTheDeads() {
    for(const fighter of fighters){
        if(fighter.stats.life<=0){
            console.log(fighter.stats.life);
            document.querySelector('[data-char="'+characters.indexOf(fighter)+'"]').parentElement.remove();
            details.innerHTML += `${fighter.name} succombe à l'attaque !!!<br><br>`;
        }
    }
    fighters = fighters.filter(char => char.stats.life > 0);
    
}

// // Faire s'affronter 2 joueurs

function fight(a, d) {
    const attackScore = getAttackScore(a);
    const defScore = getDefenseScore(d);
   
    // Get the modal
    const modal = document.getElementById("myModal");

    
    
    // Open the modal
    console.log(modal);
    modal.style.display = "block"; 

    document.getElementById('imgFightersAtt').src = a.img_sm;
    document.getElementById('imgFightersDef').src = d.img_sm;
    details.innerHTML = `${a.name} avec une attaque de ${attackScore} fonce sur ${d.name} qui a une défense de ${defScore}.<br><br>`;
    console.log(`${a.name} avec une attaque de ${attackScore} fonce sur ${d.name} qui a une défense de ${defScore}.`);
    if (attackScore > defScore) {
        decreaseLife(d, attackScore-defScore);
        details.innerHTML += `${d.name} perd ${attackScore-defScore} points de vie, `;
        if(d.stats.life>0){
            details.innerHTML += `il lui en reste ${d.stats.life} !<br><br>`;
        }
        console.log(`${d.name} perd ${attackScore-defScore} points de vie, il lui en reste ${d.stats.life} !`); 
        buryTheDeads();
        return true;
    }
    details.innerHTML += `${d.name} résiste à l'attaque !<br><br>`;
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
        details.innerHTML += `Le gagnant est ${fighters[0].name} avec ${fighters[0].stats.life} PV restant.`;
        console.log(`The winner is ${fighters[0].name}.`);
        let link = document.querySelector(".fighters a");
        link.classList.add("winner-pic");
        document.getElementById("fighters").innerHTML = "<img class='winner' src='https://redswan5.com/wp-content/uploads/2017/04/WinnerGraphic-1-900x756.jpg' alt='winner' >";
        document.getElementById("fighters").appendChild(link);
        document.getElementById("new-select").style.display="block";
        document.getElementById("fight").style.display="none";
        const pvAtt = document.getElementById("pv-att");
        pvAtt.setAttribute("value", attacker.stats.life);
        const pvDef = document.getElementById("pv-def");
        pvDef.setAttribute("value", defender.stats.life);
        return;
    }

    const pvAtt = document.getElementById("pv-att");
    pvAtt.setAttribute("value", attacker.stats.life);
    const pvDef = document.getElementById("pv-def");
    pvDef.setAttribute("value", defender.stats.life);

    return; //battle();
}

document.getElementById("fight").addEventListener("click", battle);

document.getElementById("new-select").addEventListener("click", function(e){
    document.getElementById("myModal").style.display="none";
    fighters = []
    const battlefield = document.getElementById("fighters");
    battlefield.firstElementChild.remove();
    const link = battlefield.firstElementChild;
    
    link.classList.remove("winner-pic");
    console.log(link);
    link.firstElementChild.src = characters[link.dataset.char].img_xs;
    document.getElementById("characters").appendChild(link);
    battlefield.innerHTML = "";
    document.getElementById("new-select").style.display="none";
    document.getElementById("fight").style.display="block";
});


