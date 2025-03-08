// Branch Pre-Master


var objCanvas = null;
var objC2D = null;
var objCycleAnimation = null;
var objSons = null;
var objControlleurJeu = null;

var objMurs = null;
var objCarteTuile = null;

var objJoueur = null;
var objStatJeu = null;

var lingotsRamasses = 0;

var joueurEnMouvement = false;

var objGardes = null;

var debutAppDEBUG = performance.now();

/**
 *  -----------------------
 *   Initialization du jeu
 *  -----------------------
 */


// Changer à cause du nomination
function initJeu() {
    // Pour débogger
    document.getElementById('monCanvas').style.outline = "thick solid rgb(0, 0, 0)";

    console.log('init animation v1');
    objCanvas = document.getElementById('monCanvas')
    // objCanvas.focus(); //DECOMENENTEZ!!!!!!


    objC2D = objCanvas.getContext('2d');

    initSons();

    initControlleurJeu();
    initStatistiqueJeu();
    initMurs();
    initCarteTuile();

    initJoueur();
    initGardes();

    dessiner();
    animer();
}

function initSons(){
    objSons = new Object();

    var objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/lingot.mp3');
    objSon.volume = 0.05;
    objSon.load();
    objSons.lingot = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/prochaineNiveau.mp3');
    objSon.load();
    objSons.prochaineNiveau = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/lodeRunnerPerdVie.mp3');
    objSon.playbackRate = 0.5
    objSon.load();
    objSons.lodeRunnerPerdVie = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/lodeRunnerTombe.mp3');
    objSon.playbackRate = 0.5
    objSon.load();
    objSons.lodeRunnerTombe = objSon;
    objSons.lodeRunnerTombeJoue = false;
    
    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/lodeRunnerTrou.mp3');
    objSon.load();
    objSons.lodeRunnerTrou = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/gameOver.mp3');
    objSon.volume = 0.5;
    objSon.load();
    objSons.gameOver = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/gameOver.mp3');
    objSon.volume = 0.5;
    objSon.load();
    objSons.gameOver = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/briqueConstruction.mp3');
    objSon.load();
    objSons.briqueConstruction = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/gardeMort.mp3');
    objSon.load();
    objSons.gardeMort = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', './audio/gardeTrou.mp3');
    objSon.load();
    objSons.gardeTrou = objSon;

}

function initControlleurJeu() {
    objControlleurJeu = new Object();

    objControlleurJeu.cleHaut = false;
    objControlleurJeu.cleBas = false;
    objControlleurJeu.cleGauche = false;
    objControlleurJeu.cleDroit = false;

    objControlleurJeu.jeuPause = true;
    objControlleurJeu.binProchaineNiveau = false;

}

function initStatistiqueJeu(){
    objStatJeu = new Object();

    objStatJeu.temps = 0;

    objStatJeu.secondsEcoule = 0;
    objStatJeu.minuteEcoule = 0;

    objStatJeu.intVie = 5; // Changer a 5
    objStatJeu.intNiveau = 1;

    objStatJeu.score = 0;
    objStatJeu.scoreDebutNiveau = 0;

    objStatJeu.nombreLingot = 6; //Changer a 6
}

function initMurs() {
    objMurs = new Object();

    let largeurMur = 25;

    objMurs.tabMurs = [];
    objMurs.strCouleur = 'yellow'

    let murHaut = new Object();
    murHaut.xDebut = 0;
    murHaut.xFin = objCanvas.width;
    murHaut.yDebut = 0;
    murHaut.yFin = largeurMur;

    objMurs.tabMurs.push(murHaut);


    let murDroite = new Object();
    murDroite.xDebut = objCanvas.width - largeurMur;
    murDroite.xFin = objCanvas.width;
    murDroite.yDebut = 0;
    murDroite.yFin = objCanvas.height;

    objMurs.tabMurs.push(murDroite);


    let murBas = new Object();
    murBas.xDebut = 0;
    murBas.xFin = objCanvas.width;
    murBas.yDebut = objCanvas.height - largeurMur;
    murBas.yFin = objCanvas.height;

    objMurs.tabMurs.push(murBas);

    let murGauche = new Object();
    murGauche.xDebut = 0;
    murGauche.xFin = largeurMur;
    murGauche.yDebut = 0;
    murGauche.yFin = objCanvas.height;

    objMurs.tabMurs.push(murGauche);
}

// Initialize un carte de tuile V, Il faut encore le peupler avec divers type
// De plus, le carte de tuile peut seulement dessiner des tuiles V il faut encore mettre en place 
// le code pour les tuiles non V

// V = Vide
// B = Béton
// P = Paserelle
// E = Echelle
// F = Barre de franchissement
// L = Lingot d'or
// T = trou temporaire
function initCarteTuile(){
    objCarteTuile = new Object();
    
    objCarteTuile.xAlignementCarte = -25;
    objCarteTuile.yAlignementCarte = -25;
    objCarteTuile.xFinCarte = objCanvas.width;
    objCarteTuile.yFinCarte = objCanvas.height;

    objCarteTuile.xLargeurTuile = 50;
    objCarteTuile.yLargeurTuile = 50;

    objCarteTuile.tabTuile = []
    objCarteTuile.tabPotentielle = [] // Un tableau pour mettre les endroits potentiels des lingots et des gardes

    for(let x = 1; x <= objCarteTuile.xFinCarte/objCarteTuile.xLargeurTuile;x++){
        for(let y = 1; y <= objCarteTuile.yFinCarte/objCarteTuile.yLargeurTuile; y++){

            let tuileInsere = {tuileX: x, tuileY: y, type: 'V',binTrouPlein: false,compteurTuile: -1}

            // Plancher de béton
            if(y >= 17){
                tuileInsere.type = 'B'
            }

            // Plancher de paserelle
            if(y == 16){
                tuileInsere.type = 'P'
            }

            
            // Niveau 1 Paserelle
            if(y == 14 && ((x >= 6 && x <= 12) || (x >= 21 && x <= 27))
            ){
                tuileInsere.type = 'P'
            }

            // Niveau 2 Paserelle
            if(y == 11 && (x <= 20)){
                tuileInsere.type = 'P'
            }

            // Niveau 3 Paserelle
            if(y == 8 && ((x <= 8) || (x >= 12))){
                tuileInsere.type = 'P'
            }

            // Block de paserelle à niveau 3
            if(x >= 12 && x <= 13 && y >= 5 && y <= 8){
                tuileInsere.type = 'P'
            }

            // Niveau 4 Paserelle
            if(y == 5 && (x >= 18)){
                tuileInsere.type = 'P'
            }

            // Niveau 5 Paserelle
            if(y == 3 && x <= 15){
                tuileInsere.type = 'P'
            }

            // Tous les Échelle
            if( ((y >= 14 && y <= 15) && (x == 5)) ||
                ((y >= 14 && y <= 15) && (x == 28)) ||
                ((y >= 11 && y <= 13) && (x == 10)) ||
                ((y >= 8 && y <= 10) && (x == 3)) || 
                ((y >= 8 && y <= 13) && (x == 21)) || 
                ((y >= 5 && y <= 7) && (x == 14)) || 
                ((y >= 5 && y <= 7) && (x == 26)) || 
                ((y >= 3 && y <= 7) && (x == 8))
            ){
                tuileInsere.type = 'E'
            }
            
            // Barre de franchissement
            if( y == 13 && (x >= 11 && x <= 20) ||
                y == 4 && (x >= 9 && x <= 17)
            ){
                tuileInsere.type = 'F'
            }



            if(x <= 28){
                objCarteTuile.tabTuile.push(tuileInsere)
            }
            
        }
    }


    objCarteTuile.tabTuile.forEach((tuileVide) => {
        let binTuilePotentielle = false;

        if(tuileVide.type == 'V'){
            objCarteTuile.tabTuile.forEach((tuilePaserelle) => {
                if(tuileVide.tuileX == tuilePaserelle.tuileX &&
                    tuileVide.tuileY == tuilePaserelle.tuileY - 1 &&
                    tuilePaserelle.type == 'P'
                ){
                    binTuilePotentielle = true;
                }
            })
        }

        if(binTuilePotentielle){
            objCarteTuile.tabPotentielle.push(tuileVide)
        }
    })

    for(let i = 1; i <= 6; i++){
        let tuilesBarrePossible = objCarteTuile.tabPotentielle.filter((tuile) => tuile.type == 'V' && tuile.tuileY <= 14);
        tuilesBarrePossible[randInt(0,tuilesBarrePossible.length - 1)].type = 'L'
    }

    for(let i = 1; i <= 2 + objStatJeu.intNiveau; i++){
        let tuilesGardePossible = objCarteTuile.tabPotentielle.filter((tuile) => tuile.type == 'V' && tuile.tuileY <= 14 );
        tuilesGardePossible[randInt(0,tuilesGardePossible.length - 1)].type = 'G'
    }



}


function initJoueur() {
    objJoueur = new Object();

    objJoueur.compteurFrame = 1;

    objJoueur.largeur = 40;
    objJoueur.hauteur = 50;

    objJoueur.positionX = objCanvas.width/2; // Changer a objCanvas.width/2
    objJoueur.positionY = 775; //775

    objJoueur.vitesseX = 3;
    objJoueur.vitesseY = 2;
    objJoueur.direction = 0;

    objJoueur.binTomber = false;
    objJoueur.tuileActive = {};

    objJoueur.tuileEntourage = []

    objJoueur.binGrimpeEchelle = false;
    objJoueur.binRelache = false;
    objJoueur.binMort = false;

    objJoueur.tempsCreuseTrou = -1;
    objJoueur.directionCreuseTrou = 0;
}


function initGardes(){
    objGardes = new Object();

    objGardes.largeur = 40;
    objGardes.hauteur = 50;

    objGardes.vitesseX = 2;
    objGardes.vitesseY = 2;

    objGardes.tabGardes = [];

    let listeCouleurCorps = [
        "red",
        "blue",
        "green",
        "yellow",
        "cyan",
        "magenta"
    ]

    objCarteTuile.tabTuile.forEach((tuileGarde) => {
        if(tuileGarde.type == 'G'){
            let objGarde = new Object();
            objGarde.positionX = tuileGarde.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2; //
            objGarde.positionY = tuileGarde.tuileY*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile/2;
            objGarde.direction = 0;
        
            objGarde.tuileActive = {}
            objGarde.tuileEntourage = []
            objGarde.tempsTrou = -1;
        
            objGarde.binGrimpeEchelle = false;
            objGarde.binRelache = false;
            objGarde.binMort = false;
            objGarde.tuileMort = null;
            objGarde.binLingot = false;
        
            objGarde.couleurCorps = listeCouleurCorps[randInt(0,listeCouleurCorps.length - 1)]
        
            objGardes.tabGardes.push(objGarde)

            tuileGarde.type == 'V'
        }

    })



}

/**
 *  ----------------------
 *  Fonction Préliminaire
 *  ----------------------
 */

function animer() {
    objCycleAnimation = requestAnimationFrame(animer);

    // Cycle d'animation
    effacerDessin();
    mettreAjourAnimation();
    dessiner();
}

function arreterAnimation() {
    if (objCycleAnimation != null) {
        cancelAnimationFrame(objCycleAnimation);
    }
    objCycleAnimation = null;
}

function effacerDessin() {
    objC2D.clearRect(0, 0, objCanvas.width, objCanvas.height);
}


/**
*  -----------------
*   Logique du jeu
*  -----------------
*/

function mettreAjourAnimation() {

    // Gestion de game over
    if(objStatJeu.intVie <= 0){
        objStatJeu.jeuPause = true;
        objJoueur.positionY = objCanvas.height*2;
        objSons.gameOver.play();
    }


    if(!objControlleurJeu.jeuPause){
        miseAJourStatistique();

        //deplacerGardes();
        miseAJourJoueur();
        miseAJourGardes();
        miseAJourTuiles()
    }


    

    // Gestion quand joueur perd
    if(objJoueur.binMort && objJoueur.positionY + objJoueur.hauteur/2 < 0){
        initCarteTuile();
        initGardes();
        initJoueur();
        objStatJeu.intVie--;
        objStatJeu.score = objStatJeu.scoreDebutNiveau;
    }
    else if(objJoueur.binMort){
        objJoueur.positionY -= objJoueur.vitesseY;
    }
    else if(objControlleurJeu.binProchaineNiveau){
        joueurProchaineNiveau();
    }
    else if(objJoueur.positionY <= objCarteTuile.yLargeurTuile*1){
        objControlleurJeu.jeuPause = true;
        objControlleurJeu.binProchaineNiveau = true;
        objSons.prochaineNiveau.play();
    }
    
}

// Évenement pour détecter les touches du utilisateur
document.addEventListener('keydown', (event) => {
    if(!objControlleurJeu.jeuPause && objJoueur.tempsCreuseTrou < 0){

        let tuileGauchBas = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY + 1
        )
    
        let tuileDroitBas = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY + 1
        )

        let tuileGauche = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY
        )
    
        let tuileDroit = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY
        )

        if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = true;
        if (event.key == 'ArrowLeft') {
            objControlleurJeu.cleGauche = true;
            objJoueur.direction = -1;
        }
        if (event.key == 'ArrowRight') {
            objControlleurJeu.cleDroit = true;
            objJoueur.direction = 1;
        }
        if (event.key == 'ArrowDown') objControlleurJeu.cleBas = true;
        if (event.key == 'x' && tuileGauchBas.type == 'P' && tuileGauche.type != 'L') {
            objJoueur.tempsCreuseTrou = 30;
            objJoueur.direction = -1;
        }
        if (event.key == 'z' && tuileDroitBas.type == 'P' && tuileDroit.type != 'L') {
            objJoueur.tempsCreuseTrou = 30;
            objJoueur.direction = 1;
        }
    }

    
    // Fait en sorte de commencer le jeu (ou le niveau)
    if(objJoueur.positionY > 1*objCarteTuile.yLargeurTuile && 
        objControlleurJeu.jeuPause &&
        objJoueur.binMort == false &&
        objStatJeu.intVie > 0
    ){
        objControlleurJeu.jeuPause = false;
        objJoueur.binGrimpeEchelle = false;

        debutAppDEBUG = performance.now()//DEBUG ENLEVER
    }

})

document.addEventListener('keyup', (event) => {
    if(!objControlleurJeu.jeuPause){
        if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = false;
        if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = false;
        if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = false;
        if (event.key == 'ArrowDown') objControlleurJeu.cleBas = false;
    }
    
})

function miseAJourStatistique(){
    objStatJeu.temps += 1;

    if(objStatJeu.temps % 60 == 0){
        objStatJeu.secondsEcoule += 1;
    }

    if(objStatJeu.secondsEcoule >= 60){
        objStatJeu.minuteEcoule += 1;
        objStatJeu.secondsEcoule = 0;
    }

    // Pour éviter le débordage du affichage
    if(objStatJeu.minuteEcoule >= 99){
        objStatJeu.minuteEcoule = 0;
    }

    if(objJoueur.tuileActive && objJoueur.tuileActive.type == 'L'){
        objJoueur.tuileActive.type = 'V';
        objStatJeu.score += 250;
        objSons.lingot.play();

        objStatJeu.nombreLingot--;

        if(objStatJeu.nombreLingot <= 0) genererEscalier();
    }

    // DEBUG A ENLEVER (Mesure le performance de voir si les frames sont tres en arriere)
    // if(objStatJeu.temps % 10*60 == 0){
        
    //     let tempsPerformance = (Math.round((performance.now() - debutAppDEBUG)/1000*100)/100)
    //     let tempsJeu = (Math.round((objStatJeu.temps/60)*100)/100)
        

    //     console.log( "Performance (s/s)= " +
    //         tempsJeu.toFixed(2) + "/" + 
    //         tempsPerformance.toFixed(2) + "   " +
    //         (tempsJeu > tempsPerformance ? "↑" : (tempsJeu < tempsPerformance ? "↓" : "="))
    //     )
    // }
}

function genererEscalier(){
    objCarteTuile.tabTuile.forEach((tuile) => {
        if(tuile.tuileX == 18 && tuile.tuileY <= 4) tuile.type = 'E';
    })

}

// Compter les trous et les remplir
function miseAJourTuiles(){
    objCarteTuile.tabTuile.forEach((tuile) => {
        if(tuile.type == 'T'){
            tuile.compteurTuile--;
            if(tuile.compteurTuile <= 0){
                tuile.type = 'P'
                tuile.tableMiniTuiles = null;
            }



            if(!tuile.tableMiniTuiles) {
                tabMiniTuiles = [];

                for(let i = 0; i < objCarteTuile.xLargeurTuile; i += 5){
                    for(let j = 0; j < objCarteTuile.yLargeurTuile; j += 5){
                        let tuileMiniInsere = {x: i, y: j, binEffacer: false} 
                        tabMiniTuiles.push(tuileMiniInsere)
                    }
                }

                tuile.tableMiniTuiles = tabMiniTuiles;
            }


            let delayEntreAnimation = 1;
            let vitessAnimation = 4;

            if(tuile.compteurTuile >= (8*60 - 100) && tuile.compteurTuile % delayEntreAnimation == 0){
                for(let i = 0; i < vitessAnimation; i++){
                    let tuilesEffacables = tuile.tableMiniTuiles.filter(miniTuile => !miniTuile.binEffacer);
                    if(tuilesEffacables.length !== 0){
                        tuilesEffacables[randInt(0,tuilesEffacables.length - 1)].binEffacer = true;
                    }
                }
            }
            else if(tuile.compteurTuile <= 100 && tuile.compteurTuile % delayEntreAnimation == 0){
                for(let i = 0; i < vitessAnimation; i++){
                    let tuilesEffacables = tuile.tableMiniTuiles.filter(miniTuile => miniTuile.binEffacer);
                    if(tuilesEffacables.length !== 0){
                        tuilesEffacables[randInt(0,tuilesEffacables.length - 1)].binEffacer = false;
                    }
                }
            }

            // Jouer son de reconstruction
            if(tuile.compteurTuile == 100){
                objSons.briqueConstruction.play();
            }

            
        }
    })
}

// Joueur Logique
function miseAJourJoueur(){

    objJoueur.compteurFrame++;

    objJoueur.tuileActive = {}

    objJoueur.tuileEntourage = []

    // Cette partie pourrait être un peu taxant sur l'application mais ça marche!
    objCarteTuile.tabTuile.forEach((tuile) => {
        if(objJoueur.positionX >= (tuile.tuileX) * objCarteTuile.xLargeurTuile 
            && objJoueur.positionX <= (tuile.tuileX + 1) * objCarteTuile.xLargeurTuile
            && objJoueur.positionY >= (tuile.tuileY) * objCarteTuile.yLargeurTuile 
            && objJoueur.positionY <= (tuile.tuileY + 1) * objCarteTuile.yLargeurTuile
        ){
            objJoueur.tuileActive = tuile;
        }
    })

    if(objJoueur.tuileActive){
        objJoueur.tuileEntourage = objCarteTuile.tabTuile.filter(tuile => 
            tuile.tuileX >= objJoueur.tuileActive.tuileX - 1 && tuile.tuileX <= objJoueur.tuileActive.tuileX + 1 &&
            tuile.tuileY >= objJoueur.tuileActive.tuileY - 1 && tuile.tuileY <= objJoueur.tuileActive.tuileY + 1
        )
    }

    // Creuser trous
    if(objJoueur.tempsCreuseTrou >= 0){
        if(objJoueur.tempsCreuseTrou >= 30){
            let tuileGauchBas = objJoueur.tuileEntourage.find(
                (tuile) => 
                    tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                    tuile.tuileY == objJoueur.tuileActive.tuileY + 1
            )
        
            let tuileDroitBas = objJoueur.tuileEntourage.find(
                (tuile) => 
                    tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                    tuile.tuileY == objJoueur.tuileActive.tuileY + 1
            )
    
            if(tuileGauchBas && objJoueur.direction == -1){
                tuileGauchBas.type = 'T';
                tuileGauchBas.compteurTuile = 8*60;
            }
            else if(tuileDroitBas && objJoueur.direction == 1){
                tuileDroitBas.type = 'T';
                tuileDroitBas.compteurTuile = 8*60;
            }

            objSons.lodeRunnerTrou.play();
        }

        objJoueur.positionX = objJoueur.tuileActive.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2
        objJoueur.tempsCreuseTrou--;
    }

    graviteJoueur()
    deplacementJoueur()
}


// Fonctionne plus ou moins (avant le mapping)
function deplacementJoueur() {

    let binDeplacementGauche = false;
    let binDeplacementDroite = false;
    let binDeplacementHaut = false;
    let binDeplacementBas = false;

    if (!objJoueur.binTomber) {



        // ===== Deplacement Horizontal ===== 
        let tuileGauche = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY
        )


        if(objControlleurJeu.cleGauche &&
           objJoueur.positionX > objJoueur.largeur + 25){

            if( tuileGauche && 
                tuileGauche.type == 'P' && 
                !((objJoueur.positionX - objJoueur.largeur/2) > (tuileGauche.tuileX+1)*objCarteTuile.xLargeurTuile)
            ){
                binDeplacementGauche = false;
            }
            else{
                binDeplacementGauche = true;
            }

        }


        let tuileDroit = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY
        )

        if(objControlleurJeu.cleDroit &&
            objJoueur.positionX < objCanvas.width - objJoueur.largeur/2){
 
            
             if( tuileDroit &&
                 tuileDroit.type == 'P' && 
                 !((objJoueur.positionX + objJoueur.largeur/2) < tuileDroit.tuileX*objCarteTuile.xLargeurTuile)
             ){
                 binDeplacementDroite = false;
             }
             else{
                binDeplacementDroite = true;
             }
            
             
         }

         

        // ========= Deplacement Vertical ==========



        let tuileEnBas = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX &&
                tuile.tuileY == objJoueur.tuileActive.tuileY + 1
        )

        


        if(objControlleurJeu.cleHaut){
            if(objJoueur.tuileActive.type == 'E' || tuileEnBas.type == 'E'){
                if(objJoueur.tuileActive.type == 'E' || tuileEnBas.tuileY*objCarteTuile.yLargeurTuile + objJoueur.vitesseY < objJoueur.positionY + objJoueur.hauteur/2){
                    binDeplacementHaut = true;
                    objJoueur.binGrimpeEchelle = true;
                }
                else{
                    objJoueur.binGrimpeEchelle = false;
                }
            }
        }




        if(objControlleurJeu.cleBas){
            if( (objJoueur.tuileActive.type == 'E' || tuileEnBas.type == 'E')){
                if(tuileEnBas.type == 'E' || tuileEnBas.tuileY*objCarteTuile.yLargeurTuile > objJoueur.positionY + objJoueur.hauteur/2){
                    binDeplacementBas = true;
                    objJoueur.binGrimpeEchelle = true;
                }
                else{
                    objJoueur.binGrimpeEchelle = false;
                }
            }
            else if( objJoueur.tuileActive.type == 'F' && 
                     tuileEnBas.type == 'V'
            ){
                let tuileDroitBas = objJoueur.tuileEntourage.find(
                    (tuile) => 
                        tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                        tuile.tuileY == objJoueur.tuileActive.tuileY + 1
                )

                let tuileGauchBas = objJoueur.tuileEntourage.find(
                    (tuile) => 
                        tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                        tuile.tuileY == objJoueur.tuileActive.tuileY + 1
                )

                if(
                    (tuileGauchBas.type == 'V' 
                    || (tuileGauchBas.tuileX+1) * objCarteTuile.xLargeurTuile < objJoueur.positionX - objJoueur.largeur/2) &&
                    (tuileDroitBas.type == 'V' 
                    || (tuileDroitBas.tuileX) * objCarteTuile.xLargeurTuile > objJoueur.positionX + objJoueur.largeur/2)
                ){
                    objJoueur.positionY += 6;
                    objJoueur.binRelache = true;
                }

                
            }
        }

    }
    else {
        binDeplacementGauche = false;
        binDeplacementDroite = false;
    }




    if (binDeplacementHaut) {
        objJoueur.positionY -= objJoueur.vitesseY
    }

    if (binDeplacementBas) {
        objJoueur.positionY += objJoueur.vitesseY
    }

    if (binDeplacementGauche) {
        objJoueur.positionX -= objJoueur.vitesseX;
    }

    if (binDeplacementDroite) {
        objJoueur.positionX += objJoueur.vitesseX;
    }

    if(objJoueur.binGrimpeEchelle && !binDeplacementGauche && !binDeplacementDroite){
        objJoueur.positionX = (objJoueur.tuileActive.tuileX * objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2)
    }
    else{
        objJoueur.binGrimpeEchelle = false;
    }
    

    if(objJoueur.tuileActive.type == 'P'){
        objControlleurJeu.jeuPause = true;
        objJoueur.binMort = true;
        objSons.lodeRunnerPerdVie.play();
    }
}


function graviteJoueur() {

    let binDescend = true;

    if (!(objJoueur.positionY < objMurs.tabMurs[2].yDebut)) {
        binDescend = false;
    }


    let tuileBas = objJoueur.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == objJoueur.tuileActive.tuileX  &&
            tuile.tuileY == objJoueur.tuileActive.tuileY + 1
    )

    let tuileGauchBas = objJoueur.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
            tuile.tuileY == objJoueur.tuileActive.tuileY + 1
    )

    let tuileDroitBas = objJoueur.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
            tuile.tuileY == objJoueur.tuileActive.tuileY + 1
    )


    if(tuileBas.type != 'V' && tuileBas.type != 'F' && tuileBas.type != 'L' && (tuileBas.type != 'T' || tuileBas.binTrouPlein == true)){
        if(tuileBas.tuileY*objCarteTuile.yLargeurTuile< objJoueur.positionY + objJoueur.hauteur/2){
            binDescend = false;
        }
    }
    else if(tuileBas.type == 'V' || tuileBas.type == 'T'){
        if(tuileGauchBas && tuileGauchBas.type != 'V' && 
            (tuileGauchBas.tuileX + 1 ) * objCarteTuile.xLargeurTuile > objJoueur.positionX - objJoueur.largeur/2
        ){
                binDescend = false;
        }
        else if(tuileDroitBas && tuileDroitBas.type != 'V' &&
                 (tuileDroitBas.tuileX) * objCarteTuile.xLargeurTuile < objJoueur.positionX + objJoueur.largeur/2
        ){
            binDescend = false;
        }
    }

    if(objJoueur.tuileActive.type == 'F' && objJoueur.positionY - objJoueur.hauteur/2 >= objJoueur.tuileActive.tuileY*objCarteTuile.yLargeurTuile){
        binDescend = false;
    }

    if(objJoueur.binGrimpeEchelle || objJoueur.tuileActive.type == 'E'){
        binDescend = false;
    }


    objJoueur.binTomber = binDescend;
    

    if(binDescend && !objJoueur.binGrimpeEchelle){
        objJoueur.positionY += objJoueur.vitesseY;
        objJoueur.binRelache = true;
    }
    else if(objJoueur.tuileActive.type == 'F' && !objJoueur.binRelache){
        objJoueur.positionY = objJoueur.tuileActive.tuileY*objCarteTuile.yLargeurTuile + objJoueur.hauteur/2 - objJoueur.vitesseY
    }

    // Jouer le bruit
    if(binDescend && !objSons.lodeRunnerTombeJoue && objJoueur.tuileActive.type == 'V' && (tuileBas.type == 'V' || tuileBas.type == 'T')){
        objSons.lodeRunnerTombeJoue = true;
        objSons.lodeRunnerTombe.play();
    }
    else if(!binDescend && objSons.lodeRunnerTombeJoue){
        objSons.lodeRunnerTombeJoue = false;
    }
    
}

function joueurProchaineNiveau(){
    objJoueur.positionY -= 1;

    if(objJoueur.positionY <= -objJoueur.hauteur){
        objControlleurJeu.binProchaineNiveau = false;
        objStatJeu.intNiveau++;
        objStatJeu.nombreLingot = 6;

        objStatJeu.score += 1500;
        objStatJeu.scoreDebutNiveau = objStatJeu.score;
        initCarteTuile();
        initJoueur();
        initGardes();
    }
}

function miseAJourGardes(){
    objGardes.tabGardes.forEach((garde) => {

        // Cette partie pourrait être un peu taxant sur l'application mais ça marche!
        objCarteTuile.tabTuile.forEach((tuile) => {
            if(garde.positionX >= (tuile.tuileX) * objCarteTuile.xLargeurTuile 
                && garde.positionX <= (tuile.tuileX + 1) * objCarteTuile.xLargeurTuile
                && garde.positionY >= (tuile.tuileY) * objCarteTuile.yLargeurTuile 
                && garde.positionY <= (tuile.tuileY + 1) * objCarteTuile.yLargeurTuile
            ){
                garde.tuileActive = tuile;
            }
        })

        if(garde.tuileActive){
            garde.tuileEntourage = objCarteTuile.tabTuile.filter(tuile => 
                tuile.tuileX >= garde.tuileActive.tuileX - 1 && tuile.tuileX <= garde.tuileActive.tuileX + 1 &&
                tuile.tuileY >= garde.tuileActive.tuileY - 1 && tuile.tuileY <= garde.tuileActive.tuileY + 1
            )
        }

        let tuileEnBas = garde.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == garde.tuileActive.tuileX &&
                tuile.tuileY == garde.tuileActive.tuileY + 1
        )

        let tuileEnHaut = garde.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == garde.tuileActive.tuileX &&
                tuile.tuileY == garde.tuileActive.tuileY - 1
        )

        // Deposer le lingot
        if(1 == randInt(1,200) && garde.binLingot){
            let lingotPotentielle = garde.tuileEntourage.find(
                (tuile) => 
                    tuile.tuileX == garde.tuileActive.tuileX - garde.direction &&
                    tuile.tuileY == garde.tuileActive.tuileY
            )

            let paserellePotentielle = garde.tuileEntourage.find(
                (tuile) => 
                    tuile.tuileX == garde.tuileActive.tuileX - garde.direction &&
                    tuile.tuileY == garde.tuileActive.tuileY + 1
            )

            if(lingotPotentielle.type == 'V' && lingotPotentielle.type == 'P'){
                lingotPotentielle.type = 'L'
                garde.binLingot = false;
            }
        }

        if(garde.tuileActive.type == 'P'){
            garde.binMort = true;
        }
        else if(garde.tuileActive.type == 'L' && !garde.binLingot){
            garde.binLingot = true;
            garde.tuileActive.type = 'V';
        }

        // Faire le garde tomber dans le trou
        if(!garde.binMort){
            if(garde.tempsTrou >= 60*4 ){
                garde.tempsTrou++;
                garde.binTomber = false;
    
                let xDeplacementGarde = (objJoueur.positionX - garde.positionX >= 0) ? 1 : -1;
                
                if(garde.tuileActive.type == 'T' || 
                    (garde.tuileActive.tuileY+1)*objCarteTuile.yLargeurTuile <= garde.positionY + objGardes.hauteur/2
                ){
                    garde.positionY -= objGardes.vitesseY
                }
                else{
                    garde.positionX += xDeplacementGarde*objGardes.vitesseX;
                    tuileEnBas.binTrouPlein = false;
                }
    
                if(tuileEnBas.type != 'T' && garde.tuileActive.type != 'T'){
                    garde.tempsTrou = -1;
                }
    
                garde.direction = xDeplacementGarde;
            }
            else if( garde.tuileActive.type == 'T' && 
                garde.positionY - objGardes.hauteur/2 + objGardes.vitesseY >= garde.tuileActive.tuileY*objCarteTuile.yLargeurTuile &&
                garde.tempsTrou <= 60*4
            ){
                garde.tempsTrou++;
                garde.binTomber = true;
                garde.positionX = garde.tuileActive.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2;
                garde.positionY = garde.tuileActive.tuileY*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile/2;
                garde.tuileActive.binTrouPlein = true;

                if(garde.tempsTrou < 1){
                    objStatJeu.score += 75;
                }

                if(garde.binLingot && tuileEnHaut.type == 'V'){
                    garde.binLingot = false;
                    tuileEnHaut.type = 'L';
                }
                
            }
            else{
                deplacerGarde(garde);
                graviteGardes(garde);
            }

            // Contact avec joueur
            let distanceJoueur = Math.hypot(garde.positionX - objJoueur.positionX,garde.positionY - objJoueur.positionY);

            if(distanceJoueur < 6){
                objControlleurJeu.jeuPause = true;
                objJoueur.binMort = true;
                objSons.lodeRunnerPerdVie.play();
            }
            

        }
        else {
            let positionRenaissanceGardeX = objCanvas.width/2;
            let positionRenaissanceGardeY = 2*objCarteTuile.yLargeurTuile;
            let intSecondsDeplacement = 3;

            if(garde.tuileMort == null){
                garde.tuileMort = garde.tuileActive;
            }
            else if(garde.tuileMort == garde.tuileActive){
                objSons.gardeMort.play();
            }

            let deplacementGardeX = (positionRenaissanceGardeX - (garde.tuileMort.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2))/(intSecondsDeplacement*60)
            let deplacementGardeY = (positionRenaissanceGardeY - (garde.tuileMort.tuileY*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile/2))/(intSecondsDeplacement*60)
        
            garde.positionX += deplacementGardeX;
            garde.positionY += deplacementGardeY;

            let distanceEntreRennaissance = Math.sqrt(
                Math.pow(positionRenaissanceGardeX - garde.positionX,2) +
                Math.pow(positionRenaissanceGardeY - garde.positionY,2)
            )

            if(distanceEntreRennaissance <= 5){
                garde.tuileMort = null;
                garde.binMort = false;
                garde.tempsTrou = -1;
                objStatJeu.score += 75;
            }
        }
        

        // Jouer sons si garde tombe dans trous
        if(tuileEnBas.type == 'T' && garde.binTomber){
            objSons.gardeTrou.play()
        }

    })

}

/**
 * Doit perfectionner le movement
 */

function deplacerGarde(garde){
    let binDeplacementGauche = false;
    let binDeplacementDroite = false;
    let binDeplacementHaut = false;
    let binDeplacementBas = false;

    let distanceJoueurX = objJoueur.positionX - garde.positionX;
    let distanceJoueurY = objJoueur.positionY - garde.positionY;

    let directionGardeXPrefere = (distanceJoueurX >= 0) ? 1 : -1;
    let directionGardeYPrefere = (distanceJoueurY >= 0) ? 1 : -1;

    let toleranceEntreJoueur = 5;


    let tuileBut = null;
    let distanceTuile = Number.MAX_SAFE_INTEGER;


    let tuileHaut = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX &&
            tuile.tuileY == garde.tuileActive.tuileY - 1
    )

    let tuileBas = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX &&
            tuile.tuileY == garde.tuileActive.tuileY + 1
    )

    let tuileGauche = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX - 1 &&
            tuile.tuileY == garde.tuileActive.tuileY
    ) 

    let tuileDroit = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX + 1 &&
            tuile.tuileY == garde.tuileActive.tuileY
    ) 


    if(Math.abs(distanceJoueurY) >= toleranceEntreJoueur){
        objCarteTuile.tabTuile.forEach((tuile) => {
            let binTuilePossible = false;

            if(directionGardeYPrefere == 1){
                if(tuile.type == 'V' && tuile.tuileY == garde.tuileActive.tuileY){
                    objCarteTuile.tabTuile.forEach((tuileEchelle) => {
                        if( (tuileEchelle.type == 'E' || tuileEchelle.type == 'V') && 
                            tuileEchelle.tuileY == tuile.tuileY + 1 &&
                            tuileEchelle.tuileX == tuile.tuileX
                        ){
                            binTuilePossible = true;
                        }
                    })
                }
                else if(tuile.type == 'E' && tuile.tuileY == garde.tuileActive.tuileY){
                    objCarteTuile.tabTuile.forEach((tuileEchellePotentielle) => {
                        if( tuileEchellePotentielle.type == 'E' && 
                            tuileEchellePotentielle.tuileY == tuile.tuileY + 1 &&
                            tuileEchellePotentielle.tuileX == tuile.tuileX
                        ){
                            binTuilePossible = true;
                        }
                    })
                }
            }
            else if(directionGardeYPrefere == -1){
                if(tuile.type == 'E' && tuile.tuileY == garde.tuileActive.tuileY){
                    objCarteTuile.tabTuile.forEach((tuileHaut) => {
                        if( (tuileHaut.type == 'E' || tuileHaut.type == 'V') && 
                            tuileHaut.tuileY == tuile.tuileY - 1 &&
                            tuileHaut.tuileX == tuile.tuileX
                        ){
                            binTuilePossible = true;
                        }
                    })
                }
            }

            if(binTuilePossible){
                let distanceTuileCourant = Math.sqrt(
                    Math.pow(garde.positionX - (tuile.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2),2) +
                    Math.pow(garde.positionY - (tuile.tuileY*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile/2),2)
                )


                if(distanceTuileCourant < distanceTuile){
                    distanceTuile = distanceTuileCourant;
                    tuileBut = tuile;
                }
            }
        })
    }

    if(!garde.binTomber){
        if(tuileBut){
                let distanceTuileBut = (tuileBut.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2) - garde.positionX
                directionGardeXPrefere = (distanceTuileBut >= 0) ? 1 : -1;

                if( Math.abs(distanceTuileBut) >= 5 && 
                    (((tuileBut.tuileY+1)*objCarteTuile.yLargeurTuile >= garde.positionY + objGardes.hauteur/2 - objGardes.vitesseY &&
                    directionGardeYPrefere == -1) ||
                    (tuileBut.tuileY*objCarteTuile.yLargeurTuile <= garde.positionX - objGardes.hauteur/2 + objGardes.vitesseY &&
                    directionGardeYPrefere == 1
                    ))
                ){
                    if(directionGardeXPrefere == 1){
                        binDeplacementDroite = true;
                    }
                    else if(directionGardeXPrefere == -1){
                        binDeplacementGauche = true;
                    }
                }
                else{
                    if(directionGardeYPrefere == 1){
                        binDeplacementBas = true;
                    }
                    else if(directionGardeYPrefere == -1){
                        binDeplacementHaut = true;
                    }
                }
        }
        else{
            if(tuileBas.type == 'E' || 
                tuileBas.tuileY*objCarteTuile.yLargeurTuile + objGardes.vitesseY >= garde.positionY + objGardes.hauteur/2){
                if(directionGardeXPrefere == 1){
                    binDeplacementDroite = true;
                }
                else if(directionGardeXPrefere == -1){
                    binDeplacementGauche = true;
                }
            }
            else{
                if(directionGardeYPrefere == 1){
                    binDeplacementBas = true;
                }
                else if(directionGardeYPrefere == -1){
                    binDeplacementHaut = true;
                }
            }

        }
    }




    garde.binGrimpeEchelle = false;
    if((garde.tuileActive.type == 'E' || tuileBas.type == 'E') && (binDeplacementBas || binDeplacementHaut)){
        if(garde.tuileActive.type == 'E' || tuileBas.tuileY*objCarteTuile.yLargeurTuile + objGardes.vitesseY <= garde.positionY + objGardes.hauteur/2){
            garde.binGrimpeEchelle = true;
        }
        else{
            garde.binGrimpeEchelle = false;
        }
    }

    // Collisions horizontales
    
    if(tuileGauche && tuileGauche.type == 'P' && (tuileGauche.tuileX+1)*objCarteTuile.xLargeurTuile >= garde.positionX - objGardes.largeur/2 - objGardes.vitesseX){
        binDeplacementGauche = false;
    }

    if(tuileDroit && tuileDroit.type == 'P' && tuileDroit.tuileX*objCarteTuile.xLargeurTuile <= garde.positionX + objGardes.largeur/2 + objGardes.vitesseX){
        binDeplacementDroite = false;
    }

    // Collision avec le plancher si c'est un paserelle vers le bas
    if((tuileBas.type == 'P' && garde.positionY + objGardes.hauteur/2 + objGardes.vitesseY >= tuileBas.tuileY*objCarteTuile.yLargeurTuile)){
        binDeplacementBas = false;
    }

    // Obtenir les tuiles actives des autre gardes
    let tuilesGardes = []

    objGardes.tabGardes.forEach(garde => {
        tuilesGardes.push(garde.tuileActive);
    })


    if(binDeplacementGauche && tuilesGardes.filter((tuile) => tuile == tuileGauche).length == 0){
        garde.positionX -= objGardes.vitesseX;
    }
    if(binDeplacementDroite && tuilesGardes.filter((tuile) => tuile == tuileDroit).length == 0){
        garde.positionX += objGardes.vitesseX;
    }
    if(binDeplacementHaut && tuilesGardes.filter((tuile) => tuile == tuileHaut).length == 0){
        garde.positionY -= objGardes.vitesseY;
    }
    if(binDeplacementBas && tuilesGardes.filter((tuile) => tuile == tuileBas).length == 0){
        garde.positionY += objGardes.vitesseY;
    }

    // Envoyez information pour le dessinage
    garde.direction = directionGardeXPrefere;
}

function graviteGardes(garde){
    let binDescend = true;

    if (!(garde.positionY < objMurs.tabMurs[2].yDebut)) {
        binDescend = false;
    }


    let tuileBas = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX  &&
            tuile.tuileY == garde.tuileActive.tuileY + 1
    )

    let tuileGauchBas = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX - 1 &&
            tuile.tuileY == garde.tuileActive.tuileY + 1
    )

    let tuileDroitBas = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX + 1 &&
            tuile.tuileY == garde.tuileActive.tuileY + 1
    )


    if(tuileBas.type == 'P' || tuileBas.type == 'B' || tuileBas.type == 'E' || (tuileBas.type == 'T' && tuileBas.binTrouPlein)){
        if(tuileBas.tuileY*objCarteTuile.yLargeurTuile < garde.positionY + objGardes.hauteur/2){
            binDescend = false;
        }
    }
    else if(!(tuileBas.type == 'P' || tuileBas.type == 'B')){
        if(tuileGauchBas && tuileGauchBas.type != 'V' && 
            (tuileGauchBas.tuileX + 1 ) * objCarteTuile.xLargeurTuile > garde.positionX - objGardes.largeur/2
        ){
            binDescend = false;
        }
        else if(tuileDroitBas && tuileDroitBas.type != 'V' &&
            (tuileDroitBas.tuileX) * objCarteTuile.xLargeurTuile < garde.positionX + objGardes.largeur/2
        ){
            binDescend = false;
        }
    }

    if(garde.tuileActive.type == 'P'){
        binDescend = false;
    }
    else if(garde.tuileActive.type == 'F' && garde.positionY - objGardes.hauteur/2 >= garde.tuileActive.tuileY*objCarteTuile.yLargeurTuile){
        binDescend = false;
    }

    if(garde.binGrimpeEchelle){
        binDescend = false;
    }

    garde.binTomber = binDescend;

    if(binDescend){
        garde.positionY += objGardes.vitesseY
        garde.binRelache = true;
    }
    else if(garde.tuileActive.type == 'F' && !garde.binRelache){
        garde.positionY = garde.tuileActive.tuileY*objCarteTuile.yLargeurTuile + garde.hauteur/2 - 1
    }
}


/**
 * -----------------
 *  Dessinage du jeu
 * -----------------
 */

function dessiner() {
    objC2D.save();


    // Dessiner l'environnement 
    dessinerTuiles();
    

    dessinerPointage();
    

    dessinerGardes();

    dessinerMurs();
    dessinerJoueur()

    dessinerGameOver();
    objC2D.restore();
}



// +- complèt
function dessinerTuiles() {
    objC2D.save();

    objC2D.translate(
        objCarteTuile.xAlignementCarte,
        objCarteTuile.yAlignementCarte
    )

    objCarteTuile.tabTuile.forEach((tuile) => {
        objC2D.save();

        objC2D.translate(
            tuile.tuileX * objCarteTuile.xLargeurTuile,
            tuile.tuileY * objCarteTuile.yLargeurTuile
        )

        dessinerUnTuile(tuile);

        objC2D.restore();
    })


    objC2D.restore();
}

function dessinerUnTuile(tuile) {
    objC2D.save();

    objC2D.fillStyle = `rgb(${Math.random() * 255}, 
    ${Math.random() * 255}, 
    ${Math.random() * 255})`;

    objC2D.strokeStyle = `rgb(${Math.random() * 255}, 
    ${Math.random() * 255}, 
    ${Math.random() * 255})`;


    // Dessiner le vide
    objC2D.fillStyle = 'rgb(0,0,0)';

    objC2D.beginPath();
    objC2D.rect(
        0,
        0,
        objCarteTuile.xLargeurTuile,
        objCarteTuile.yLargeurTuile
    )
    objC2D.fill();

    if (tuile.type == 'B') {
        dessinerBeton();
    }
    else if (tuile.type == 'P') {
        dessinerPaserelle();
    }
    else if (tuile.type == 'E') {
        dessinerEchelle();
    }
    else if(tuile.type == 'F'){
        dessinerBarreDeFranchissement();
    }
    else if(tuile.type == 'L'){
        dessinerLingots()
    }
    else if(tuile.type == 'T'){
        dessinerTrou(tuile);
    }

    objC2D.restore();
}

function dessinerBeton(){
    objC2D.fillStyle = 'rgb(92, 92, 92)';

        objC2D.beginPath();
        objC2D.rect(
            0,
            0,
            objCarteTuile.xLargeurTuile,
            objCarteTuile.yLargeurTuile
        )
        objC2D.fill();


        objC2D.fillStyle = 'rgb(54, 54, 54)'
        let padTuile = 5;

        objC2D.beginPath();
        objC2D.rect(
            padTuile,
            padTuile,
            objCarteTuile.xLargeurTuile - padTuile * 2,
            objCarteTuile.yLargeurTuile - padTuile * 2
        )
        objC2D.fill();
}

function dessinerPaserelle(){
        objC2D.save();
    
        // Base du paserelle
        objC2D.fillStyle = 'rgb(72, 72, 72)'
        objC2D.beginPath();
        objC2D.rect(
            0,
            0,
            objCarteTuile.xLargeurTuile,
            objCarteTuile.yLargeurTuile
        )
        objC2D.fill();


        // Les briques
        let padBrique = 3;

        objC2D.fillStyle = 'rgb(191, 51, 51)'

        objC2D.beginPath();
        objC2D.rect(
            padBrique,
            padBrique,
            objCarteTuile.xLargeurTuile / 2 - padBrique,
            objCarteTuile.yLargeurTuile / 2 - padBrique
        )
        objC2D.fill();

        objC2D.beginPath();
        objC2D.rect(
            objCarteTuile.xLargeurTuile / 2 + padBrique,
            padBrique,
            objCarteTuile.xLargeurTuile / 2 - padBrique * 2,
            objCarteTuile.yLargeurTuile / 2 - padBrique
        )
        objC2D.fill();

        objC2D.beginPath();
        objC2D.rect(
            padBrique,
            objCarteTuile.yLargeurTuile / 2 + padBrique,
            objCarteTuile.xLargeurTuile - padBrique * 2,
            objCarteTuile.yLargeurTuile / 2 - padBrique * 2
        )
        objC2D.fill();

        objC2D.restore();
}

function dessinerEchelle(){
    let largeurBarrePrincipale = 5;

        objC2D.fillStyle = 'rgb(191, 147, 51)'
        objC2D.strokeStyle = 'rgb(191, 147, 51)'

        // Barre #1
        objC2D.beginPath();
        objC2D.rect(
            0,
            0,
            largeurBarrePrincipale,
            objCarteTuile.yLargeurTuile
        )
        objC2D.fill();

        // Barre #2
        objC2D.beginPath();
        objC2D.rect(
            objCarteTuile.xLargeurTuile - largeurBarrePrincipale,
            0,
            objCarteTuile.xLargeurTuile,
            objCarteTuile.yLargeurTuile
        )
        objC2D.fill();

        // Ajouter les petits barres
        for(let i = 5; i < objCarteTuile.yLargeurTuile; i += 10){
            objC2D.beginPath();
            objC2D.moveTo(0, i);
            objC2D.lineTo(objCarteTuile.xLargeurTuile, i);
            objC2D.stroke();
        }

}

function dessinerBarreDeFranchissement(){
    // Barre de franchissement
    // Base du paserelle
    objC2D.fillStyle = 'rgb(135, 58, 32)'
    objC2D.beginPath();
    objC2D.rect(
        0,
        3,
        objCarteTuile.xLargeurTuile,
        5
    )
    objC2D.fill();
}

function dessinerLingots() {
    objC2D.save();

    let x = 0;
    let y = 42;

    // Couleur dorée
    objC2D.fillStyle = "#FFD700";
    
    // Amas de lingots avec plusieurs petites briques
    let largeur = 10; // Largeur d'un petit lingot
    let hauteur = 8;  // Hauteur d'un petit lingot
    let lignes = 3;    // Nombre de lignes de lingots
    let colonnes = 4;  // Nombre de colonnes de lingots

    for (let i = 0; i < lignes; i++) {
        for (let j = 0; j < colonnes - i; j++) { // Réduction du nombre de lingots sur chaque ligne pour un effet pyramidal
            let offsetX = x + j * largeur + (i * largeur / 2);
            let offsetY = y - i * hauteur;

            // Base du lingot
            objC2D.fillStyle = "#FFD700";
            objC2D.fillRect(offsetX, offsetY, largeur, hauteur);

            // Ombre pour effet 3D
            objC2D.fillStyle = "#DAA520";
            objC2D.fillRect(offsetX + largeur / 3, offsetY + hauteur / 3, largeur / 1.5, hauteur / 1.5);
        }
    }

    // Effet de brillance sur le haut des lingots
    objC2D.fillStyle = "#FFFACD";
    objC2D.beginPath();
    objC2D.arc(x + 20, y - 5, 4, 0, Math.PI * 2);
    objC2D.fill();


    objC2D.restore();
}

function dessinerTrou(tuile) {
    objC2D.save();

    dessinerPaserelle();

    objC2D.fillStyle = 'rgb(0,0,0)'
    if(tuile.tableMiniTuiles){
        
        tuile.tableMiniTuiles.forEach(miniTuile => {
            if(miniTuile.binEffacer){
                objC2D.fillRect(
                    miniTuile.x,
                    miniTuile.y,
                    5,
                    5
                )
            }
        })
    }

    if(tuile.compteurTuile < (8*60-100) && tuile.compteurTuile >= 100){
        objC2D.fillRect(
            0,
            0,
            objCarteTuile.xLargeurTuile,
            objCarteTuile.yLargeurTuile
        )
    }
    


    objC2D.restore();
}


function dessinerMurs() {
    objC2D.save();


    objC2D.save();
    objC2D.fillStyle = objMurs.strCouleur;

    objMurs.tabMurs.forEach((mur) => {
        objC2D.beginPath();
        objC2D.rect(
            mur.xDebut,
            mur.yDebut,
            mur.xFin,
            mur.yFin
        )
        objC2D.fill();
    })
    objC2D.restore();

    
    objC2D.save();
    objC2D.fillStyle = 'black'
    objC2D.font = "30px arial";
    objC2D.textAlign = "center"
    objC2D.fillText(
        'Par Milesh Patel et Abel Aimé Moussy Minyogok',
        objCanvas.width/2,
        objCanvas.height - 2
    )
    objC2D.restore();


    objC2D.restore();
}


function dessinerJoueur() {
    objC2D.save();

    let x = objJoueur.positionX;
    let y = objJoueur.positionY;

    objC2D.translate(x-25,y-25)

    if(objJoueur.binGrimpeEchelle && objJoueur.positionY % 16 <= 8){
        objC2D.scale(-1,1)
    }
    if(objJoueur.binTomber && objStatJeu.temps % 15 <= 7){
        objC2D.scale(-1,1)
    }
    if(objJoueur.direction == 1){
        objC2D.scale(-1,1)
    }
    


    let largeurTete = 10;
    let hauteurTete = 9;

    // Couleur par défaut
    objC2D.fillStyle = 'white'
    
    
    let tuileBas = objJoueur.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == objJoueur.tuileActive.tuileX  &&
            tuile.tuileY == objJoueur.tuileActive.tuileY + 1
    )


    
    if(false); // POur debug
    else if(objJoueur.tuileActive.type == 'F' && tuileBas.type == 'V'){
        if(objJoueur.positionX % 90 <= 30){
            // Premier frame 
            largeurTete = 6
            hauteurTete = 12
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4 + 1,largeurTete + 2,hauteurTete)
                                                            
            // Bras Droite
            objC2D.fillRect(-12,-11,9,4)
            objC2D.fillRect(-15,-22,7,11)
                                    
            // Bras Gauche
            objC2D.fillRect(9,-8,7,4)
            objC2D.fillRect(13,-21,7,14)
                                                    
            // Corps
            objC2D.fillRect(1,-8,8,12)
                                    
            // Jambe 1
            objC2D.fillRect(1,4,4,9)
            objC2D.fillRect(5,9,6,4)
            objC2D.fillRect(8,12,7,4)
                                    
            // Jambe Gauche
            objC2D.fillRect(8,0,10,4)
            objC2D.fillRect(15,4,8,8)
            objC2D.fillRect(19,4,4,12)
        }
        else{
            if(objJoueur.positionX % 90 >= 60){
                objC2D.scale(-1,1)
            }

            // Deuxieme et troisieme frame 
            largeurTete = 6
            hauteurTete = 7
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4 + 1,largeurTete + 2,hauteurTete)
                                
            // Bras Droite
            objC2D.fillRect(3,-10,7,4)
            objC2D.fillRect(5,-19,8,9)

            // Bras Gauche
            objC2D.fillRect(-10,-8,13,4)
            objC2D.fillRect(-15,-4,8,4)
                        
            // Corps
            objC2D.fillRect(-3,-8,8,15)

            // Jambe 1
            objC2D.fillRect(2,7,7,10)

            // Jambe 2 
            objC2D.fillRect(-8,7,7,10)    
        }
        
    }
    else if(objJoueur.binGrimpeEchelle){
        // Dessiner le grimpe echelle du personnage
        largeurTete = 6
        objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4,largeurTete + 2,hauteurTete)
                            
        // Bras Droite
        objC2D.fillRect(5,-2,12,4)
        objC2D.fillRect(13,-8,4,6)

        // Bras Gauche
        objC2D.fillRect(-21,-8,12,4)
        objC2D.fillRect(-21,-14,4,6)
                    
        // Corps
        objC2D.fillRect(-9,-8,14,23)

        // Jambe 1
        objC2D.fillRect(-12,15,8,8) 
        objC2D.fillRect(-16,19,12,4)

        // Jambe 2
        objC2D.fillRect(1,15,8,12) 
        objC2D.fillRect(1,23,12,4)
    }
    else if(objJoueur.binTomber){
        // Dessiner le tomber du personnage

        //Dessiner le casque
        objC2D.fillStyle = 'cyan'
        objC2D.fillRect(-1,-21,4,5)
        objC2D.fillStyle = 'white'

        objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4,largeurTete + 2,hauteurTete)
                        
        // Bras Droite
        objC2D.fillRect(6,-8,7,4)
        objC2D.fillRect(11,-16,7,9)
        // objC2D.fillRect(10,0,9,4)

        // Bras Gauche
        objC2D.fillRect(-10,-8,13,4)
        objC2D.fillRect(-16,-16,7,9)
                
        // Corps
        objC2D.fillRect(0,-8,7,25)

        // Jambe 2 
        objC2D.fillRect(-10,2,10,3)
        objC2D.fillRect(-12,5,6,8) 
    }
    else if(objControlleurJeu.cleGauche || objControlleurJeu.cleDroit){
        if(objStatJeu.temps % 30 <= 10){

            //Dessiner le casque
            objC2D.fillStyle = 'cyan'
            objC2D.fillRect(-1,-21,4,5)
            objC2D.fillStyle = 'white'

            // Position Marche 1
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4,largeurTete + 2,hauteurTete)
                    
            // Bras 1
            // objC2D.fillRect(-4,-8,14,4)
            objC2D.fillRect(6,-4,9,4)
            objC2D.fillRect(10,0,9,4)

            // Bras 2
            objC2D.fillRect(-10,1,13,4)
            objC2D.fillRect(-10,-3,4,4)
            
            // Corps
            objC2D.fillRect(-2,-8,9,20)

            // Jambe 1
            objC2D.fillRect(4,10,5,5)
            objC2D.fillRect(7,13,5,5)
            objC2D.fillRect(8,16,7,7)

            // Jambe 2 
            objC2D.fillRect(-4,10,5,5)
            objC2D.fillRect(-8,13,7,7) 

        }
        else if(objStatJeu.temps % 30 <= 20){

            //Dessiner le casque
            objC2D.fillStyle = 'cyan'
            objC2D.fillRect(-1,-21,4,5)
            objC2D.fillStyle = 'white'

            // Position Marche 2
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4,largeurTete + 2,hauteurTete)
                    
            // Bras 1
            // objC2D.fillRect(-4,-8,14,4)
            objC2D.fillRect(6,-4,5,4)
            objC2D.fillRect(7,0,7,7)

            // Bras 2
            objC2D.fillRect(-6,1,4,4)
            objC2D.fillRect(-14,5,8,4)
            
            // Corps
            objC2D.fillRect(-2,-8,9,20)

            // Jambe 1
            objC2D.fillRect(4,10,5,5)
            objC2D.fillRect(7,13,5,5)
            objC2D.fillRect(8,16,7,7)

            // Jambe 2 
            objC2D.fillRect(-7,10,7,7)
                    
        }
        else if(objStatJeu.temps % 30 <= 30){

            //Dessiner le casque
            objC2D.fillStyle = 'cyan'
            objC2D.fillRect(-1,-21,4,5)
            objC2D.fillStyle = 'white'


            // Position Marche 3
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4,largeurTete + 2,hauteurTete)
            
            // Bras 1
            objC2D.fillRect(-4,-8,14,4)
            objC2D.fillRect(8,-4,9,4)
            objC2D.fillRect(12,0,9,4)

            // Bras 2
            objC2D.fillRect(-8,-4,13,4)
            objC2D.fillRect(-15,0,7,4)

            // Corps
            objC2D.fillRect(-1,0,8,14)

            // Jambe 1
            objC2D.fillRect(4,14,16,3)

            // Jambe 2 
            objC2D.fillRect(-4,12,5,5)
            objC2D.fillRect(-8,15,7,12)   
        }
    }
    else{
        // Position Marche 3 (pour idle)

        //Dessiner le casque
        objC2D.fillStyle = 'cyan'
        objC2D.fillRect(-1,-21,4,5)
        objC2D.fillStyle = 'white'

        objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objJoueur.hauteur/4,largeurTete + 2,hauteurTete)



        // Bras 1
        objC2D.fillRect(-4,-8,14,4)
        objC2D.fillRect(8,-4,9,4)
        objC2D.fillRect(12,0,9,4)

        // Bras 2
        objC2D.fillRect(-8,-4,13,4)
        objC2D.fillRect(-15,0,7,4)

        // Corps
        objC2D.fillRect(-1,0,8,14)

        // Jambe 1
        objC2D.fillRect(4,14,16,3)

        // Jambe 2 
         objC2D.fillRect(-4,12,5,5)
        objC2D.fillRect(-8,15,7,12) 

        
        // Dessiner laser si joueur creuse un trou
        if(objJoueur.tempsCreuseTrou >= 0){
            let adjustementLaser = 5;

            objC2D.beginPath();
            objC2D.globalAlpha = 0.5
            objC2D.moveTo(-15,0);
            objC2D.lineTo(-objCarteTuile.xLargeurTuile - objJoueur.largeur/2 - adjustementLaser,objJoueur.hauteur/2);
            objC2D.lineTo(-objJoueur.largeur/2 - adjustementLaser,objJoueur.hauteur/2);
        }
        
        
        
        objC2D.fill();  

    }

    objC2D.restore();
}

function dessinerGardes(){
    objC2D.save();

    
    
    objGardes.tabGardes.forEach((garde) => {
        objC2D.save();

        let couleurTete = 'rgb(240, 212, 184)'

        if(garde.binLingot){
            couleurTete = 'rgb(255, 166, 22)'
        }

        let x = garde.positionX;
        let y = garde.positionY;
    
        objC2D.translate(x-25,y-25)

        if(garde.binGrimpeEchelle && garde.positionY % 16 <= 8){
            objC2D.scale(-1,1)
        }
        if(garde.binTomber && garde.positionY % 32 <= 16 && !garde.binMort){
            objC2D.scale(-1,1)
        }
        if(garde.direction == 1){
            objC2D.scale(-1,1)
        }

        let largeurTete = 10;
        let hauteurTete = 9;
    
    
        objC2D.fillStyle = 'white'
        
        
        let tuileBas = garde.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == garde.tuileActive.tuileX  &&
                tuile.tuileY == garde.tuileActive.tuileY + 1
        )



        if(false); // POur debug
        else if(garde.tuileActive.type == 'F' && tuileBas.type == 'V'){
            if(garde.positionX % 90 <= 30){
                // Premier frame 
                objC2D.fillStyle = couleurTete
                largeurTete = 6
                hauteurTete = 12

                objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4 + 1,largeurTete + 2,hauteurTete)
                                   
                objC2D.fillStyle = garde.couleurCorps
                // Bras Droite
                objC2D.fillRect(-12,-11,9,4)
                objC2D.fillRect(-15,-22,7,11)
                                        
                // Bras Gauche
                objC2D.fillRect(9,-8,7,4)
                objC2D.fillRect(13,-21,7,14)
                                                        
                // Corps
                objC2D.fillRect(1,-8,8,12)
                                      
                objC2D.fillStyle = 'white'
                // Jambe 1
                objC2D.fillRect(1,4,4,9)
                objC2D.fillRect(5,9,6,4)
                objC2D.fillRect(8,12,7,4)
                                        
                // Jambe Gauche
                objC2D.fillRect(8,0,10,4)
                objC2D.fillRect(15,4,8,8)
                objC2D.fillRect(19,4,4,12)
            }
            else{
                if(garde.positionX % 90 >= 60){
                    objC2D.scale(-1,1)
                }
    
                // Deuxieme et troisieme frame 
                objC2D.fillStyle = couleurTete
                largeurTete = 6
                hauteurTete = 7

                objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4 + 1,largeurTete + 2,hauteurTete)
                                
                objC2D.fillStyle = garde.couleurCorps
                // Bras Droite
                objC2D.fillRect(3,-10,7,4)
                objC2D.fillRect(5,-19,8,9)
    
                // Bras Gauche
                objC2D.fillRect(-10,-8,13,4)
                objC2D.fillRect(-15,-4,8,4)
                            
                // Corps
                objC2D.fillRect(-3,-8,8,15)
    
                objC2D.fillStyle = 'white'
                // Jambe 1
                objC2D.fillRect(2,7,7,10)
    
                // Jambe 2 
                objC2D.fillRect(-8,7,7,10)    
            }
            
        }
        else if(garde.binGrimpeEchelle){
            objC2D.fillStyle = couleurTete
            // Dessiner le grimpe echelle du personnage
            largeurTete = 6
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4,largeurTete + 2,hauteurTete)
                                
            objC2D.fillStyle = garde.couleurCorps
            // Bras Droite
            objC2D.fillRect(5,-2,12,4)
            objC2D.fillRect(13,-8,4,6)
    
            // Bras Gauche
            objC2D.fillRect(-21,-8,12,4)
            objC2D.fillRect(-21,-14,4,6)
                        
            // Corps
            objC2D.fillRect(-9,-8,14,23)
    
            objC2D.fillStyle = 'white'
            // Jambe 1
            objC2D.fillRect(-12,15,8,8) 
            objC2D.fillRect(-16,19,12,4)
    
            // Jambe 2
            objC2D.fillRect(1,15,8,12) 
            objC2D.fillRect(1,23,12,4)
        }
        else if(garde.binTomber){
            // Dessiner le tomber du personnage
            objC2D.fillStyle = 'cyan'
            objC2D.fillRect(-1,-21,4,5)

            objC2D.fillStyle = couleurTete
            objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4,largeurTete + 2,hauteurTete)
                            
            objC2D.fillStyle = garde.couleurCorps
            // Bras Droite
            objC2D.fillRect(6,-8,7,4)
            objC2D.fillRect(11,-16,7,9)
    
            // Bras Gauche
            objC2D.fillRect(-10,-8,13,4)
            objC2D.fillRect(-16,-16,7,9)
                    
            // Corps
            objC2D.fillRect(0,-8,7,25)
    
            objC2D.fillStyle = 'white'
            // Jambe 1
            objC2D.fillRect(0,7,7,10)

            // Jambe 2 
            objC2D.fillRect(-10,2,10,3)
            objC2D.fillRect(-12,5,6,8) 
        }
        else{
            if(objStatJeu.temps % 30 <= 10){
                // Position Marche 1
                objC2D.fillStyle = 'cyan'
                objC2D.fillRect(-1,-21,4,5)

                objC2D.fillStyle = couleurTete
                objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4,largeurTete + 2,hauteurTete)
                        
                objC2D.fillStyle = garde.couleurCorps
                // Bras 1
                objC2D.fillRect(6,-4,9,4)
                objC2D.fillRect(10,0,9,4)
    
                // Bras 2
                objC2D.fillRect(-10,1,13,4)
                objC2D.fillRect(-10,-3,4,4)
                
                // Corps
                objC2D.fillRect(-2,-8,9,20)
    
                objC2D.fillStyle = 'white'
                // Jambe 1
                objC2D.fillRect(4,10,5,5)
                objC2D.fillRect(7,13,5,5)
                objC2D.fillRect(8,16,7,7)
    
                // Jambe 2 
                objC2D.fillRect(-4,10,5,5)
                objC2D.fillRect(-8,13,7,7) 
    
            }
            else if(objStatJeu.temps % 30 <= 20){
                // Position Marche 2
                objC2D.fillStyle = 'cyan'
                objC2D.fillRect(-1,-21,4,5)

                objC2D.fillStyle = couleurTete
                objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4,largeurTete + 2,hauteurTete)
                        
                objC2D.fillStyle = garde.couleurCorps
                // Bras 1
                objC2D.fillRect(6,-4,5,4)
                objC2D.fillRect(7,0,7,7)
    
                // Bras 2
                objC2D.fillRect(-6,1,4,4)
                objC2D.fillRect(-14,5,8,4)
                
                // Corps
                objC2D.fillRect(-2,-8,9,20)

                objC2D.fillStyle = 'white'
                // Jambe 1
                objC2D.fillRect(4,10,5,5)
                objC2D.fillRect(7,13,5,5)
                objC2D.fillRect(8,16,7,7)
    
                // Jambe 2 
                objC2D.fillRect(-7,10,7,7)
                        
            }
            else if(objStatJeu.temps % 30 <= 30){
                // Position Marche 3

                //Dessiner le casque
                objC2D.fillStyle = 'cyan'
                objC2D.fillRect(-1,-21,4,5)


                objC2D.fillStyle = couleurTete            
                objC2D.fillRect(-largeurTete/2,-hauteurTete/2 - objGardes.hauteur/4,largeurTete + 2,hauteurTete)
                
                objC2D.fillStyle = garde.couleurCorps
                // Bras 1
                objC2D.fillRect(-4,-8,14,4)
                objC2D.fillRect(8,-4,9,4)
                objC2D.fillRect(12,0,9,4)
    
                // Bras 2
                objC2D.fillRect(-8,-4,13,4)
                objC2D.fillRect(-15,0,7,4)
    
                // Corps
                objC2D.fillRect(-1,0,8,14)
    

                objC2D.fillStyle = 'white'   
                // Jambe 1
                objC2D.fillRect(4,14,16,3)
    
                // Jambe 2 
                objC2D.fillRect(-4,12,5,5)
                objC2D.fillRect(-8,15,7,12)   
            }
        }
        
        objC2D.restore();
    })

    objC2D.restore();
}

function dessinerPointage(){
    objC2D.save();

    objC2D.translate(
        -objCarteTuile.xAlignementCarte,
        -objCarteTuile.yAlignementCarte
    )

    let largeurTableauStat = 28*objCarteTuile.xLargeurTuile


    objC2D.fillStyle = 'black'
    objC2D.fillRect(
        0,
        17*objCarteTuile.yLargeurTuile,
        28*objCarteTuile.xLargeurTuile,
        objCarteTuile.yLargeurTuile*2
    )


    // Les points
    let strPointage = 'Score:' + (String(objStatJeu.score).padStart(7,'0'));

    objC2D.fillStyle = 'yellow'
    objC2D.font = "48px impact"
    objC2D.textAlign = "center"
    objC2D.fillText(
        strPointage,
        largeurTableauStat * 1/8,
        17*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile
    );

    // Temps écoulé
    let strTemps = 'Temps: '
    strTemps += (objStatJeu.minuteEcoule <= 9) ? '0' + objStatJeu.minuteEcoule : objStatJeu.minuteEcoule
    strTemps += ':'
    strTemps += (objStatJeu.secondsEcoule <= 9) ? '0' + objStatJeu.secondsEcoule : objStatJeu.secondsEcoule

    objC2D.fillStyle = 'yellow'
    objC2D.font = "48px impact"
    objC2D.textAlign = "center"
    objC2D.fillText(
        strTemps,
        largeurTableauStat * 3/8,
        17*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile
    );

    // Niveau
    let strNiveau = 'Niveau: ' + ((objStatJeu.intNiveau <= 9) ? '0' + objStatJeu.intNiveau : objStatJeu.intNiveau);
    objC2D.fillStyle = 'yellow'
    objC2D.font = "48px impact"
    objC2D.textAlign = "center"
    objC2D.fillText(
        strNiveau,
        largeurTableauStat * 5/8,
        17*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile
    );


    // Vies
    let strVies = 'Vie: ' + objStatJeu.intVie
    objC2D.fillStyle = 'yellow'
    objC2D.font = "48px impact"
    objC2D.textAlign = "center"
    objC2D.fillText(
        strVies,
        largeurTableauStat * 7/8,
        17*objCarteTuile.yLargeurTuile + objCarteTuile.yLargeurTuile
    );

    objC2D.restore();
}

function dessinerGameOver(){
    objC2D.save();
    if(objStatJeu.intVie <= 0){
        objC2D.font = '256px impact';
        objC2D.textAlign = 'center';
        objC2D.textBaseline = 'middle';

        objC2D.fillStyle = 'yellow';
        objC2D.fillText("Game Over!",objCanvas.width/2,objCanvas.height/2);

        objC2D.strokeStyle = 'black';
        objC2D.lineWidth = 5;
        objC2D.strokeText("Game Over!",objCanvas.width/2,objCanvas.height/2);
    }
    objC2D.restore();
}


// ========== Fonctions arbritaires ===================

// Fonction de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random (légèrement modifié)
function randInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)); 
}
