let characters = [];
let fighters = [];
let details =document.getElementById("details") ;
let resumeF = [];

try{
    fetch("https://akabab.github.io/superhero-api/api/all.json")
    .then(response => response.json())
    .then(json => getCharacters(json));
}
catch (error) {
    console.error("error" + error);
}

cancelFighter();

function setStats(obj){
    str = "<a href='#' title='Weapon : "+obj.stats.weapon+
    "\nShield : "+obj.stats.shield+
    "\nCombat : "+obj.stats.combat+
    "\nLife : "+obj.stats.life+
    "' class='char-list' data-char='"+characters.indexOf(obj)+
    "'><img src='"+obj.img_xs+"' alt='"+obj.name+"'> " +obj.name+ " </a>";
    return str;
}

if(localStorage.getItem("resume") !== null){
    resumeF = JSON.parse(localStorage.getItem("resume"));
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
            infoChar.is_dead = false;
            infoChar.fight = 0;
            infoChar.total_attacks_succeed = 0;
            infoChar.total_attacks_failed = 0;
            infoChar.total_damage_dealt = 0;
            infoChar.total_damage_received = 0;
            infoChar.kills = 0;
            infoChar.ennemies_killed = [];
            infoChar.killed_by = "";
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
            fighter.is_dead = true;
            fighter.killed_by = a.name;
            fighter.fight++;
            console.table(fighter);
            document.getElementById("cimetery").appendChild(document.querySelector('[data-char="'+characters.indexOf(fighter)+'"]').parentElement);
            details.innerHTML += `${fighter.name} succombe à l'attaque !!!<br><br>`;
            a.stats.combat++;
            a.kills++;
            a.ennemies_killed.push(fighter.name);
            const combat = document.querySelector('[data-char="'+characters.indexOf(a)+'"] + ul li:nth-child(3)');
            combat.innerHTML = "combat : "+a.stats.combat;
        }
    }
    fighters = fighters.filter(char => char.stats.life > 0);
    
}

// Faire s'affronter 2 joueurs
function fight(a, d) {    
    const attackScore = getAttackScore(a);
    const defScore = getDefenseScore(d);
   
    // Get the modal
    const modal = document.getElementById("myModal");

    // Open the modal
    modal.style.display = "block"; 

    document.getElementById("att-f").innerText = a.name;
    document.getElementById("def-f").innerText = d.name;
    document.getElementById('imgFightersAtt').src = a.img_sm;
    document.getElementById('imgFightersDef').src = d.img_sm;
    details.innerHTML = `${a.name} avec une attaque de ${attackScore} fonce sur ${d.name} qui a une défense de ${defScore}.<br><br>`;
    if (attackScore > defScore) {
        const damage = attackScore-defScore;
        a.total_attacks_succeed++;
        a.total_damage_dealt += damage;
        d.total_damage_received += damage;
        decreaseLife(d, damage);
        details.innerHTML += `${d.name} perd ${damage} points de vie, `;
        if(d.stats.life>0){
            details.innerHTML += `il lui en reste ${d.stats.life} !<br><br>`;
        }
        buryTheDeads(a);
        return true;
    }
    a.total_attacks_failed++;
    d.def++;
    details.innerHTML += `${d.name} résiste à l'attaque !<br><br>`;
    if(d.def%3 === 0) d.stats.shield-=2;
    const def = document.querySelector('[data-char="'+characters.indexOf(d)+'"] + ul li:nth-child(2)');
    def.innerHTML = "shield : "+d.stats.shield;
    return false;
}

function battle() {
    if(document.getElementById("fighters").childElementCount < 2){
        alert("Veuillez choisir au moins 2 combattants !");
        return;
    }
    const attacker = getRandomChar();
    const defender = getRandomChar(attacker);
    
    fight(attacker, defender);
    
    if (fighters.length <= 1) {
        details.innerHTML += `Le gagnant est ${fighters[0].name} avec ${fighters[0].stats.life} PV restant.`;
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
        fighters[0].fight++;
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
    document.getElementById("characters").appendChild(link);
    battlefield.innerHTML = "";
    fighters = []
    document.getElementById("new-select").style.display="none";
    document.getElementById("fight").style.display="block";
    resumeF = characters.filter(c => c.fight > 0);
    try {
        localStorage.setItem("chars", JSON.stringify(document.getElementById("characters").innerHTML));
        localStorage.setItem("characters", JSON.stringify(characters));
        localStorage.setItem("resume", JSON.stringify(resumeF));
        localStorage.setItem("cimetery", JSON.stringify(document.getElementById("cimetery").innerHTML));
      }
    catch(e){console.log(e, "error");}
    document.location.reload();
});

document.getElementById("reset").addEventListener("click", function(e){
    localStorage.removeItem("chars");
    localStorage.removeItem("characters");
    localStorage.removeItem("cimetery");
    localStorage.removeItem("resume");
    document.location.reload();
});

document.getElementById("cimetery-btn").addEventListener("click", function(e){
    document.getElementById("cimetery").classList.toggle("cim-display");
    document.getElementById("main-fight").classList.toggle("main-fight-display");
});

let modalResume = document.querySelector(".modal-resume-content")

// Ecrire le résumé des combats dans la modal
for(const c of resumeF){
    const killed = c.ennemies_killed.join(", ");
    modalResume.innerHTML += "<span class='resume-name'>"+ c.name+ " :</span><br>";
    modalResume.innerHTML += "<pre>   Nombre de combats : "+ c.fight+ "</pre>";
    modalResume.innerHTML += c.is_dead ? "<pre>   Toujours vivant : Non (tué par "+ c.killed_by +") </pre>" : "<pre>   Toujours vivant : Oui </pre>" + "</pre>";
    modalResume.innerHTML += "<pre>   Total d'attaques loupées : "+ c.total_attacks_failed + ",   Total d'attaques réussies : "+ c.total_attacks_succeed + "</pre>";
    modalResume.innerHTML += "<pre>   Total de dégâts infligés : "+ c.total_damage_dealt + ",   Total de dégâts reçus : "+ c.total_damage_received + "</pre>";
    modalResume.innerHTML += c.ennemies_killed.length !== 0 ? "<pre>   Total de kills : "+ c.kills + ",   (" + killed + ")</pre>" : "<pre>   Total de kills : "+ c.kills + "</pre>";
}

document.getElementById("resume").addEventListener("click", function(e){
    document.getElementById("modal-resume").classList.toggle("hidden");
});

document.getElementById("rules").addEventListener("click", function(e){
    document.getElementById("modal-rules").classList.toggle("hidden");
});