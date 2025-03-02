// Branch Pre-Master
//
/**
 *  NOTE POUR PROJET
 *  Sur github, les contributions n'est pas representative de qui fait quoi. 
 * 
 */

var objCanvas = null;
var objC2D = null;
var objCycleAnimation = null;

var objControlleurJeu = null;

var objMurs = null;
var objCarteTuile = null;

var objJoueur = null;
var objStatJeu = null;

var lingotsRamasses = 0;

var joueurEnMouvement = false;

var objGardes = null;



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

    initControlleurJeu();
    initStatistiqueJeu();
    initMurs();
    initCarteTuile();

    initJoueur();
    initGardes();

    dessiner();
    animer();
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

    objStatJeu.intVie = 10;
    objStatJeu.intNiveau = 1;
    objStatJeu.score = 0;
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

            let tuileInsere = {tuileX: x, tuileY: y, type: 'V'}

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



            if(tuileInsere.type == 'P'){
                let tuileEnHaut = new Object();

                tuileEnHaut.y = y - 1;
                tuileEnHaut.x = x;

                if(y != 4 && x != 18){
                    objCarteTuile.tabPotentielle.push(tuileEnHaut)
                }
                
            }

            if(x <= 28){
                objCarteTuile.tabTuile.push(tuileInsere)
            }
            
        }
    }

    for(let i = 1; i <= 6; i++){
        let binBarrePlace = false;
        
        while(!binBarrePlace){
            let tuileCoordonee = objCarteTuile.tabPotentielle[randInt(0,objCarteTuile.tabPotentielle.length - 1)]

            objCarteTuile.tabTuile.forEach((tuile) => {
                if( tuile.tuileX == tuileCoordonee.x &&
                    tuile.tuileY == tuileCoordonee.y &&
                    tuile.type == 'V'
                ){
                    tuile.type = 'L';
                    binBarrePlace = true;
                }
            })
        }

    }



}


function initJoueur() {
    objJoueur = new Object();

    objJoueur.compteurFrame = 1;

    objJoueur.largeur = 40;
    objJoueur.hauteur = 50;

    objJoueur.positionX = 23*objCarteTuile.xLargeurTuile; // Changer a objCanvas.width/2
    objJoueur.positionY = 13*objCarteTuile.yLargeurTuile; //775

    objJoueur.vitesseX = 3;
    objJoueur.vitesseY = 2;
    objJoueur.direction = 0;

    objJoueur.binTomber = false;
    objJoueur.tuileActive = {};

    objJoueur.tuileEntourage = []

    objJoueur.binGrimpeEchelle = false;
    objJoueur.binRelache = false;
}


function initGardes(){
    objGardes = new Object();

    objGardes.largeur = 40;
    objGardes.hauteur = 50;

    objGardes.vitesseX = 2;
    objGardes.vitesseY = 2;

    objGardes.tabGardes = [];

    // for(let i = 1; i <= 2 + objStatJeu.intNiveau; i++){
    //     let objGardeDebug = new Object();
    //     objGardeDebug.positionX = randInt(0,objCanvas.width)
    //     objGardeDebug.positionY = randInt(0,objCanvas.height);

    //     objGardeDebug.tuileActive = {}
    //     objGardeDebug.tuileEntourage = []

    //     objGardeDebug.binGrimpeEchelle = false;
    //     objGardeDebug.binRelache = false;

    //     objGardes.tabGardes.push(objGardeDebug)
    // }

    let objGardeDebug = new Object();
    objGardeDebug.positionX = 20*objCarteTuile.xLargeurTuile
    objGardeDebug.positionY = 14*objCarteTuile.yLargeurTuile;

    objGardeDebug.tuileActive = {}
    objGardeDebug.tuileEntourage = []

    objGardeDebug.binGrimpeEchelle = false;
    objGardeDebug.binRelache = false;

    objGardes.tabGardes.push(objGardeDebug)
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

    if(!objControlleurJeu.jeuPause){
        miseAJourStatistique();

        //deplacerGardes();
        miseAJourJoueur();
        miseAJourGardes();
    }

    if(objJoueur.positionY < objCarteTuile.yLargeurTuile*2){
        objControlleurJeu.jeuPause = true;
        objControlleurJeu.binProchaineNiveau = true;
    }

    if(objControlleurJeu.binProchaineNiveau){
        joueurProchaineNiveau();
    }
}

// Évenement pour détecter les touches du utilisateur
document.addEventListener('keydown', (event) => {
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
    if (event.key == 'x') {
        let tuileGauchBas = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY + 1
        )

        tuileGauchBas.type = 'V_P'
    }
    if (event.key == 'z') {
        let tuileDroitBas = objJoueur.tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                tuile.tuileY == objJoueur.tuileActive.tuileY + 1
        )

        tuileDroitBas.type = 'V_P'
    }
    
    if(objJoueur.positionY > objCarteTuile.yLargeurTuile*2 && objControlleurJeu.jeuPause){
        objControlleurJeu.jeuPause = false;
        objJoueur.binGrimpeEchelle = false;
    }

})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = false;
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = false;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = false;
    if (event.key == 'ArrowDown') objControlleurJeu.cleBas = false;
})

function miseAJourStatistique(){
    objStatJeu.temps += 1/60;

    if(objStatJeu.temps >= 1){
        objStatJeu.secondsEcoule += 1;
        objStatJeu.temps = 0;
        
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

        let binIngotsCollecte = true;

        objCarteTuile.tabTuile.forEach((tuile) => {
            if(tuile.type == 'L') binIngotsCollecte = false;
        })

        if(binIngotsCollecte) genererEscalier();
    }
}

function genererEscalier(){
    objCarteTuile.tabTuile.forEach((tuile) => {
        if(tuile.tuileX == 18 && tuile.tuileY <= 4) tuile.type = 'E';
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
                    // objJoueur.tuileActive = {}
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


    if(tuileBas.type != 'V' && tuileBas.type != 'F' && tuileBas.type != 'L'){
        if(tuileBas.tuileY*objCarteTuile.yLargeurTuile< objJoueur.positionY + objJoueur.hauteur/2){
            binDescend = false;
        }
    }
    else if(tuileBas.type == 'V'){
        if( tuileGauchBas.type != 'V' && 
            (tuileGauchBas.tuileX + 1 ) * objCarteTuile.xLargeurTuile > objJoueur.positionX - objJoueur.largeur/2
        ){
                binDescend = false;
        }
        else if( tuileDroitBas.type != 'V' &&
                 (tuileDroitBas.tuileX) * objCarteTuile.xLargeurTuile < objJoueur.positionX + objJoueur.largeur/2
        ){
            binDescend = false;
        }
    }

    if(objJoueur.tuileActive.type == 'F'){
        binDescend = false;
    }

    if(objJoueur.binGrimpeEchelle){
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
    
}

function joueurProchaineNiveau(){
    objJoueur.positionY -= 1;

    if(objJoueur.positionY <= -objJoueur.hauteur){
        objControlleurJeu.binProchaineNiveau = false;
        objJoueur.binGrimpeEchelle = false;
        objStatJeu.intNiveau++;

        objJoueur.positionX = objCanvas.width/2; 
        objJoueur.positionY = 775; 

        initCarteTuile();
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

        
        deplacerGarde(garde);
        graviteGardes(garde);
    })

}

/**
 * 
 * Problème avec le tuile de but pour le garde
 *  De plus si joueur va en haut le garde ne peut plus le target
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

    let ifEntrer = 0;

    if(Math.abs(distanceJoueurY) >= toleranceEntreJoueur){
        objCarteTuile.tabTuile.forEach((tuile) => {
            let binTuilePossible = false;

            if(directionGardeYPrefere == 1){
                if(tuile.type == 'V' && tuile.tuileY == garde.tuileActive.tuileY){
                    objCarteTuile.tabTuile.forEach((tuileEchelle) => {
                        if( tuileEchelle.type == 'E' && 
                            tuileEchelle.tuileY == tuile.tuileY + 1 &&
                            tuileEchelle.tuileX == tuile.tuileX
                        ){
                            binTuilePossible = true;
                            ifEntrer = 1;
                        }
                    })
                }
                else if(tuile.type == 'E' && tuile.tuileY == garde.tuileActive.tuileY){
                    objCarteTuile.tabTuile.forEach((tuileBas) => {
                        if( tuileBas.type == 'E' && 
                            tuileBas.tuileY == tuile.tuileY + 1 &&
                            tuileBas.tuileX == tuile.tuileX
                        ){
                            // binTuilePossible = true;
                            // ifEntrer = 2;
                        }
                    })

                    binTuilePossible = true;
                    ifEntrer = 2;
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

    console.log(JSON.stringify(tuileBut) + " ifEntrer=" + ifEntrer)
    // console.log(garde.tuileActive)

    if(!garde.binTomber){
        if(tuileBut){
                let distanceTuileBut = (tuileBut.tuileX*objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile/2) - garde.positionX
                directionGardeXPrefere = (distanceTuileBut >= 0) ? 1 : -1;

                if( Math.abs(distanceTuileBut) >= 5 && 
                    (((tuileBut.tuileY+1)*objCarteTuile.yLargeurTuile >= garde.positionY + objGardes.hauteur/2 - objGardes.vitesseY &&
                    directionGardeYPrefere == -1) /*||
                    (tuileBut.tuileY*objCarteTuile.yLargeurTuile <= garde.positionX - objGardes.hauteur/2 + objGardes.vitesseY &&
                    directionGardeYPrefere == 1
                    )*/)
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
            if(directionGardeXPrefere == 1){
                binDeplacementDroite = true;
            }
            else if(directionGardeXPrefere == -1){
                binDeplacementGauche = true;
            }
        }
    }


    let tuileEnBas = garde.tuileEntourage.find(
        (tuile) => 
            tuile.tuileX == garde.tuileActive.tuileX &&
            tuile.tuileY == garde.tuileActive.tuileY + 1
    )

    garde.binGrimpeEchelle = false;
    if(garde.tuileActive.type == 'E' || tuileEnBas.type == 'E'){
        if(garde.tuileActive.type == 'E' || tuileEnBas.tuileY*objCarteTuile.yLargeurTuile + objGardes.vitesseY < garde.positionY + objGardes.hauteur/2){
            garde.binGrimpeEchelle = true;
        }
        else{
            garde.binGrimpeEchelle = false;
        }
    }

    // Collisions horizontale

    



    if(binDeplacementGauche){
        garde.positionX -= objGardes.vitesseX;
    }
    if(binDeplacementDroite){
        garde.positionX += objGardes.vitesseX;
    }
    if(binDeplacementHaut){
        garde.positionY -= objGardes.vitesseY;
    }
    if(binDeplacementBas){
        garde.positionY += objGardes.vitesseY;
    }
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


    if(tuileBas.type == 'P' || tuileBas.type == 'B'){
        if(tuileBas.tuileY*objCarteTuile.yLargeurTuile< garde.positionY + objGardes.hauteur/2){
            binDescend = false;
        }
    }
    else if(!(tuileBas.type == 'P' || tuileBas.type == 'B')){
        if( tuileGauchBas.type != 'V' && 
            (tuileGauchBas.tuileX + 1 ) * objCarteTuile.xLargeurTuile > garde.positionX - objGardes.largeur/2
        ){
            binDescend = false;
        }
        else if( tuileDroitBas.type != 'V' &&
            (tuileDroitBas.tuileX) * objCarteTuile.xLargeurTuile < garde.positionX + objGardes.largeur/2
        ){
            binDescend = false;
        }
    }

    if(garde.tuileActive.type == 'F' || garde.tuileActive.type == 'P'){
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
    dessinerJoueur(Math.floor(objJoueur.compteurFrame/6),'white')
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

        dessinerUnTuile(tuile.type);

        objC2D.restore();
    })


    objC2D.restore();
}

function dessinerUnTuile(strType) {
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

    if (strType == 'B') {
        dessinerBeton();
    }
    else if (strType == 'P') {
        dessinerPaserelle();
    }
    else if (strType == 'E') {
        dessinerEchelle();
    }
    else if(strType == 'F'){
        dessinerBarreDeFranchissement();
    }
    else if(strType == 'L'){
        dessinerLingots()
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

// J'ai changé les paramètre pour rendre le code plus lisibles en haut et de rendre plus compatible
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


function dessinerJoueur(frame, couleurCorps) {
    objC2D.save();

    let x = objJoueur.positionX;
    let y = objJoueur.positionY;

    objC2D.translate(x-25,y-25)

    if(objJoueur.binGrimpeEchelle && objJoueur.positionY % 16 <= 8){
        objC2D.scale(-1,1)
    }
    if(objJoueur.binTomber && objJoueur.compteurFrame % 15 <= 7){
        objC2D.scale(-1,1)
    }
    if(objJoueur.direction == 1){
        objC2D.scale(-1,1)
    }
    


    let largeurTete = 10;
    let hauteurTete = 9;


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
        if(objJoueur.compteurFrame % 30 <= 10){

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
        else if(objJoueur.compteurFrame % 30 <= 20){

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
        else if(objJoueur.compteurFrame % 30 <= 30){
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


    // Définitiion de la couleur de la tenue du personnage
    // objC2D.fillStyle = couleurCorps || "red";

    // Corps (inclut bras et tronc)
    // objC2D.fillRect( -8, -10, 16, 20);

    // let displacement = 30;

    // objC2D.fillRect(-6, -8, 12, 16);

    // Tête (avec casque jaune) // J'au changé à blanche pour mieux le faire ressembler à lode runner (de plus je ne comprends pas la raison de casque)
    // objC2D.fillStyle = "white"; // Jaune orangé
    // objC2D.fillRect( -4, -16, 8, 8);

    // Casque cyan 
    // objC2D.fillStyle = "cyan";
    // objC2D.fillRect( -2, -18, 4, 4);

     



    if (true) {

        // // Animation des jambes
        // let jambeGaucheX = mouvement < 2 ?  4 :  6;
        // let jambeDroiteX = mouvement < 2 ?  10 :  8;
        // let jambeGaucheY = mouvement < 2 ? 26 : 24;
        // let jambeDroiteY = mouvement < 2 ? 24 : 26;

        // objC2D.fillStyle = "white";
        // objC2D.fillRect(jambeGaucheX, jambeGaucheY, 5, 10);
        // objC2D.fillRect(jambeDroiteX, jambeDroiteY, 5, 10);

        // // Animation des bras
        // let brasGaucheX = mouvement < 2 ?  2 :  5;
        // let brasDroiteX = mouvement < 2 ?  13 :  10;
        // let brasGaucheY = mouvement < 2 ? 12 : 6;
        // let brasDroiteY = mouvement < 2 ? 6 : 12;

        // objC2D.fillStyle = couleurCorps;
        // objC2D.fillRect(brasGaucheX, brasGaucheY, 5, 6);
        // objC2D.fillRect(brasDroiteX, brasDroiteY, 5, 6);



        
    } else {
        // Position immobile
        objC2D.fillStyle = "white";
        objC2D.fillRect( 5, 24, 5, 10); // Jambe gauche
        objC2D.fillRect( 10, 24, 5, 10); // Jambe droite

        objC2D.fillStyle = couleurCorps;
        objC2D.fillRect( 2, 10, 5, 6); // Bras gauche
        objC2D.fillRect( 13, 10, 5, 6); // Bras droit
    }


    objC2D.restore();
}

function dessinerGardes(){
    objC2D.save();

    objGardes.tabGardes.forEach((garde) => {
        objC2D.save();

        objC2D.translate(garde.positionX-25,garde.positionY-25);

        // Pour debug
        objC2D.fillStyle = 'red';
        objC2D.fillRect(
            -objGardes.largeur/2,
            -objGardes.hauteur/2,
            objGardes.largeur,
            objGardes.hauteur
        )

        objC2D.fillStyle = 'rgb(0, 0, 0)'
        objC2D.beginPath()
        objC2D.arc(0,0,5,0,2*Math.PI,false);
        objC2D.fill();


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


// ========== Fonctions arbritaires ===================

// Fonction de https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random (légèrement modifié)
function randInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)); 
}








// Changements à déplacer (Il ne sont pas ordonné comme le code du master alors il faut modifier le code d'avantage.)



var objGardes = [];

/*
function initGardes(nombreGardes) {
    objGardes = [];
    let couleursGardes = ["red", "green", "purple"]; // Couleurs des chandails des gardes
    let positionsUtilisees = new Set();

    let passerellesDisponibles = objCarteTuile.tabTuile.filter(tuile => tuile.type === 'P');

    for (let i = 0; i < nombreGardes; i++) {
        let positionValide = false;
        let positionGarde = null;

        while (!positionValide) {
            let tuile = passerellesDisponibles[Math.floor(Math.random() * passerellesDisponibles.length)];
            let positionX = tuile.tuileX * objCarteTuile.xLargeurTuile;
            let positionY = tuile.tuileY * objCarteTuile.yLargeurTuile - 50;

            let clePosition = `${positionX}-${positionY}`;

            if (!positionsUtilisees.has(clePosition) && !lingotsRamasses.includes(clePosition)) {
                positionGarde = {
                    x: positionX,
                    y: positionY,
                    couleur: couleursGardes[i % couleursGardes.length],
                    vitesseX: 1,
                    vitesseY: 2,
                    direction: Math.random() < 0.5 ? "gauche" : "droite",
                    enTrou: false,
                    tempsDansTrou: 0
                };
                positionsUtilisees.add(clePosition);
                positionValide = true;
            }
        }
        objGardes.push(positionGarde);
    }
}

function dessinerGardes() {
    objC2D.save();

    objGardes.forEach(garde => {
        dessinerPersonnage(garde.x, garde.y, garde.couleur);
    });

    objC2D.restore();
}

// Fonction qui gère le déplacement et la chute des gardes
function deplacerGardes() {
    objGardes.forEach(garde => {
        if (garde.enTrou) {
            garde.tempsDansTrou++;

            if (garde.tempsDansTrou >= 240) { // 4 secondes (60 FPS * 4)
                if (trouRebouche(garde.x, garde.y)) {
                    reinitialiserGarde(garde);
                } else {
                    garde.enTrou = false;
                }
            }
            return;
        }

        // Vérifier si le garde est en train de tomber
        if (gardeTombe(garde)) {
            garde.y += garde.vitesseY;
            return;
        }

        // Déplacement horizontalement en évitant les obstacles
        let nouvellePositionX = garde.x + (garde.direction === "gauche" ? -garde.vitesseX : garde.vitesseX);

        if (!collisionMur(nouvellePositionX, garde.y) && !trouDetecte(nouvellePositionX, garde.y)) {
            garde.x = nouvellePositionX;
        } else {
            garde.direction = garde.direction === "gauche" ? "droite" : "gauche";
        }
    });
}

// Vérification si un garde doit tomber
function gardeTombe(garde) {
    let positionDessous = { x: garde.x, y: garde.y + 50 };

    return !collisionPasserelle(positionDessous) && !collisionBarre(positionDessous);
}

// Vérification si un garde touche une passerelle
function collisionPasserelle(position) {
    return objCarteTuile.tabTuile.some(tuile =>
        tuile.type === 'P' && position.y === tuile.tuileY * objCarteTuile.yLargeurTuile
    );
}

// Vérification si un garde touche une barre de franchissement
function collisionBarre(position) {
    return objCarteTuile.tabTuile.some(tuile =>
        tuile.type === 'E' && position.y === tuile.tuileY * objCarteTuile.yLargeurTuile
    );
}

// Vérification si un garde se trouve devant un trou
function trouDetecte(x, y) {
    return objCarteTuile.tabTuile.some(tuile =>
        tuile.type === 'V' && tuile.tuileX * objCarteTuile.xLargeurTuile === x &&
        tuile.tuileY * objCarteTuile.yLargeurTuile === y + 50
    );
}

// Vérification si un garde touche un mur
function collisionMur(x, y) {
    return objMurs.tabMurs.some(mur => x >= mur.xDebut && x <= mur.xFin && y >= mur.yDebut && y <= mur.yFin);
}

// Vérification si un trou a été rebouché
function trouRebouche(x, y) {
    return objCarteTuile.tabTuile.some(tuile =>
        tuile.type === 'B' && tuile.tuileX * objCarteTuile.xLargeurTuile === x &&
        tuile.tuileY * objCarteTuile.yLargeurTuile === y
    );
}

// Réinitialisation de la position du garde s'il est mort dans un trou rebouché
function reinitialiserGarde(garde) {
    let positionsDisponibles = objCarteTuile.tabTuile.filter(tuile => tuile.tuileY === 2);
    let tuile = positionsDisponibles[Math.floor(Math.random() * positionsDisponibles.length)];
    garde.x = tuile.tuileX * objCarteTuile.xLargeurTuile;
    garde.y = tuile.tuileY * objCarteTuile.yLargeurTuile - 50;
    garde.enTrou = false;
    garde.tempsDansTrou = 0;
}

// Duplication du fontion animer(); (Pas bon)
// // Fonction principale d'animation
// function animer() {
//     objCycleAnimation = requestAnimationFrame(animer);
//     effacerDessin();
//     deplacerGardes();
//     dessiner();
// }

// Fonction dessiner DEBUG (garde pas commenté pour debug)
function dessinerJoueurDebug() {
    objC2D.save();

    objC2D.translate(
        objCarteTuile.xAlignementCarte,
        objCarteTuile.yAlignementCarte
    )

    objC2D.fillStyle = 'blue'
    objC2D.translate(
        objJoueur.positionX,
        objJoueur.positionY
    )

    objC2D.beginPath();
    objC2D.rect(
        -objJoueur.largeur/2,
        -objJoueur.hauteur/2,
        objJoueur.largeur,
        objJoueur.hauteur
    )
    
    objC2D.fill();


    objC2D.strokeStyle   = 'black';
    objC2D.beginPath();
    objC2D.moveTo(-objJoueur.largeur/2 + objJoueur.largeur/2,-objJoueur.hauteur/2);
    objC2D.lineTo(-objJoueur.largeur/2 + objJoueur.largeur/2,objJoueur.hauteur/2);
    objC2D.stroke();

    // objC2D.fillStyle = 'pink'
    // objC2D.beginPath();
    // objC2D.arc(0,0,5,0,2*Math.PI,false)
    // objC2D.fill();

    objC2D.restore();
}

*/
