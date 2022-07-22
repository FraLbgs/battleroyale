let characters = [];
let fighters = [];
let details =document.getElementById("details") ;

try{
    fetch("https://akabab.github.io/superhero-api/api/all.json")
    .then(response => response.json())
    .then(json => getCharacters(json));
}
catch (error) {
    console.error("error" + error);
}

cancelFighter();

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


function setStats(obj){
    str = "<a href='#' title='Weapon : "+obj.stats.weapon+
    "\nShield : "+obj.stats.shield+
    "\nCombat : "+obj.stats.combat+
    "\nLife : "+obj.stats.life+
    "' class='char-list' data-char='"+characters.indexOf(obj)+
    "'><img src='"+obj.img_xs+"' alt='"+obj.name+"'> " +obj.name+ " </a>";
    return str;
}


function getCharacters(arr){
    if(localStorage.getItem("chars") !== null){
        try{
            document.getElementById("characters").innerHTML = JSON.parse(localStorage.getItem("chars"));
            characters = JSON.parse(localStorage.getItem("characters"));
            document.getElementById("cimetery").innerHTML = JSON.parse(localStorage.getItem("cimetery"));

        }
        catch(e){console.log(e,'error');}

    }
    else{
        let stats = "";
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
            infoChar.def=0;
            characters.push(infoChar);
            stats += setStats(infoChar);
        }
        document.getElementById("characters").innerHTML = stats;
    }

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
            let divCharStats = document.createElement("div");
            divCharStats.className = "char-stat";
            const cross = "<p class='cross' id='cross'>x</p>"
            divCharStats.innerHTML += cross;
            divCharStats.appendChild(cible);
            const keys = Object.keys(characters[index].stats);
            const values = Object.values(characters[index].stats);
            for(let i=0;i<3;i++){
                li += "<li>"+keys[i]+" : "+values[i]+"</li>"
            }
            li += "<li>"+keys[3]+" : <meter class='pv' max='50' low='20' value="+values[3]+"></meter></li>"
            stats.innerHTML += li;
            divCharStats.appendChild(stats);
            document.getElementById("fighters").appendChild(divCharStats);
    
            // console.table(fighters);
        });
}

function cancelFighter(){
    const fightersList = document.querySelector(".fighters");
    fightersList.addEventListener("click", function(e){
        if(e.target.className === "cross"){
            const link = e.target.nextElementSibling;
            const index = link.dataset.char;
            link.firstElementChild.src = characters[index].img_xs;
            for(const f of fighters){
                if(link.innerText === f.name){
                    fighters.splice(fighters.indexOf(f), 1);
                }
            }
            document.getElementById("characters").appendChild(link);
            e.target.parentElement.remove();
            // console.log(fighters);
        }
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
function buryTheDeads(a) {
    for(const fighter of fighters){
        if(fighter.stats.life<=0){
            // console.log(document.querySelector('[data-char="'+characters.indexOf(fighter)+'"]'));
            document.getElementById("cimetery").appendChild(document.querySelector('[data-char="'+characters.indexOf(fighter)+'"]').parentElement);
            // document.querySelector('[data-char="'+characters.indexOf(fighter)+'"]').parentElement.remove();
            details.innerHTML += `${fighter.name} succombe à l'attaque !!!<br><br>`;
            // characters.splice([characters.indexOf(fighter)], 1);
            a.stats.combat++;
            const combat = document.querySelector('[data-char="'+characters.indexOf(a)+'"] + ul li:nth-child(3)');
            combat.innerHTML = "combat : "+a.stats.combat;
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
    // console.log(modal);
    modal.style.display = "block"; 

    document.getElementById('imgFightersAtt').src = a.img_sm;
    document.getElementById('imgFightersDef').src = d.img_sm;
    details.innerHTML = `${a.name} avec une attaque de ${attackScore} fonce sur ${d.name} qui a une défense de ${defScore}.<br><br>`;
    // console.log(`${a.name} avec une attaque de ${attackScore} fonce sur ${d.name} qui a une défense de ${defScore}.`);
    if (attackScore > defScore) {
        decreaseLife(d, attackScore-defScore);
        details.innerHTML += `${d.name} perd ${attackScore-defScore} points de vie, `;
        if(d.stats.life>0){
            details.innerHTML += `il lui en reste ${d.stats.life} !<br><br>`;
        }
        // console.log(`${d.name} perd ${attackScore-defScore} points de vie, il lui en reste ${d.stats.life} !`); 
        buryTheDeads(a);
        return true;
    }
    d.def++;
    // console.log(d.name, d.def);
    // console.log(fighters);
    details.innerHTML += `${d.name} résiste à l'attaque !<br><br>`;
    // console.log(`${d.name} résiste à l'attaque !`);
    if(d.def%3 === 0) d.stats.shield--;
    const def = document.querySelector('[data-char="'+characters.indexOf(d)+'"] + ul li:nth-child(2)');
    def.innerHTML = "shield : "+d.stats.shield;
    return false;
}

function battle() {
    if(document.getElementById("fighters").childElementCount < 2){
        alert("Veuillez choisir au moins 2 combattants !");
        return;
    }
    // console.log("test");
    const attacker = getRandomChar();
    const defender = getRandomChar(attacker);
    
    fight(attacker, defender);
    
    for(const f of fighters){
        // console.table(f.name+" PV restants : "+f.stats.life);
    }
    
    if (fighters.length <= 1) {
        // console.table(fighters);
        details.innerHTML += `Le gagnant est ${fighters[0].name} avec ${fighters[0].stats.life} PV restant.`;
        // console.log(`The winner is ${fighters[0].name}.`);
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
        // fighters[0].stats.combat++;
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
    const battlefield = document.getElementById("fighters");
    battlefield.firstElementChild.remove();
    battlefield.innerHTML = setStats(fighters[0]);
    const link = battlefield.firstElementChild;
    link.classList.remove("winner-pic");
    link.firstElementChild.src = characters[link.dataset.char].img_xs;
    document.getElementById("characters").appendChild(link);
    battlefield.innerHTML = "";
    fighters = []
    document.getElementById("new-select").style.display="none";
    document.getElementById("fight").style.display="block";
    try {
        localStorage.setItem("chars", JSON.stringify(document.getElementById("characters").innerHTML));
        localStorage.setItem("characters", JSON.stringify(characters));
        localStorage.setItem("cimetery", JSON.stringify(document.getElementById("cimetery").innerHTML));
      }
    catch(e){console.log(e, "error");}
});

document.getElementById("reset").addEventListener("click", function(e){
    localStorage.removeItem("chars");
    localStorage.removeItem("cimetery");
    document.location.reload();
});

document.getElementById("cimetery-btn").addEventListener("click", function(e){
    // console.log(document.getElementById("cimetery"));
    document.getElementById("cimetery").classList.toggle("cim-display");
    document.getElementById("main-fight").classList.toggle("main-fight-display");
});