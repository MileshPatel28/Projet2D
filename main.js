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

var objGardes = [];



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
    objCanvas.focus();


    objC2D = objCanvas.getContext('2d');

    initControlleurJeu();
    initStatistiqueJeu();
    initMurs();
    initCarteTuile();

    initJoueur();

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

            objCarteTuile.tabTuile.push(tuileInsere)
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

    objJoueur.compteurFrame = 0;

    objJoueur.largeur = 50;
    objJoueur.hauteur = 50;

    objJoueur.positionX = objCanvas.width/2; // Changer a objCanvas.width/2
    objJoueur.positionY = 775; //775

    objJoueur.vitesseY = 3;
    objJoueur.vitesseX = 4;

    objJoueur.binTomber = true;
    objJoueur.tuileActive = {};

    objJoueur.tuileEntourage = []

    objJoueur.binGrimpeEchelle = false;

    objJoueur.binRelache = false;
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

        deplacerGardes();
        miseAJourJoueur();
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
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = true;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = true;
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
                if(objJoueur.tuileActive.type == 'E' || tuileEnBas.tuileY*objCarteTuile.yLargeurTuile <= objJoueur.positionY + objJoueur.hauteur/2){
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
                    || (tuileGauchBas.tuileX+1) * objCarteTuile.xLargeurTuile + objJoueur.largeur/2 < objJoueur.positionX) &&
                    (tuileDroitBas.type == 'V' 
                    || (tuileDroitBas.tuileX) * objCarteTuile.xLargeurTuile - objJoueur.largeur/2 > objJoueur.positionX)
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

    if(objJoueur.binGrimpeEchelle){
        objJoueur.positionX = (objJoueur.tuileActive.tuileX * objCarteTuile.xLargeurTuile + objJoueur.largeur/2)
    }
    
}

// A programmer
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
        if(tuileBas.tuileY * objCarteTuile.yLargeurTuile < objJoueur.positionY + objJoueur.hauteur/2){
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
        objStatJeu.intNiveau++;

        objJoueur.positionX = objCanvas.width/2; 
        objJoueur.positionY = 775; 

        initCarteTuile();
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

    dessinerJoueurDebug();
    dessinerJoueur(objJoueur.compteurFrame,'white')

    // =============================== Jamais faire logique de jeu dans dessiner ====================================
    // Déplacer les gardes avant de les dessiner
    // deplacerGardes();

    // Dessin animation des joueurs
    // let frame = Math.floor(performance.now() / 100 % 4);

    // let joueurs = [
    //     { x: 150, y: 200, couleur: "red" },
    //     { x: 250, y: 200, couleur: "green" },
    //     { x: 350, y: 200, couleur: "purple" }
    // ];

    // joueurs.forEach(joueur => {
    //     dessinerJoueur(frame, joueur.couleur, joueur.x, joueur.y); -> Déplacer en haut
    // });
    // =============================== Jamais faire logique de jeu dans dessiner ====================================
    // Dessiner les gardes après mise à jour
    dessinerGardes();

    dessinerMurs();

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

    let centreJoueurDessinX = 10;
    let centreJoueurDessinY = 8;

    let x = objJoueur.positionX - objJoueur.largeur/2 - centreJoueurDessinX;
    let y = objJoueur.positionY - objJoueur.hauteur/2 - centreJoueurDessinY;

    // Définitiion de la couleur de la tenue du personnage
    objC2D.fillStyle = couleurCorps || "red";

    // Corps (inclut bras et tronc)
    objC2D.fillRect(x + 4, y + 8, 12, 16);

    // Tête (avec casque jaune) // J'au changé à blanche pour mieux le faire ressembler à lode runner (de plus je ne comprends pas la raison de casque)
    objC2D.fillStyle = "white"; // Jaune orangé
    objC2D.fillRect(x + 6, y, 8, 8);

    // Casque cyan 
    objC2D.fillStyle = "cyan";
    objC2D.fillRect(x + 8, y - 2, 4, 4);

    if (joueurEnMouvement) {
        let mouvement = frame % 4;

        // Animation des jambes
        let jambeGaucheX = mouvement < 2 ? x + 4 : x + 6;
        let jambeDroiteX = mouvement < 2 ? x + 10 : x + 8;
        let jambeGaucheY = mouvement < 2 ? y + 26 : y + 24;
        let jambeDroiteY = mouvement < 2 ? y + 24 : y + 26;

        objC2D.fillStyle = "white";
        objC2D.fillRect(jambeGaucheX, jambeGaucheY, 5, 10);
        objC2D.fillRect(jambeDroiteX, jambeDroiteY, 5, 10);

        // Animation des bras
        let brasGaucheX = mouvement < 2 ? x + 2 : x + 5;
        let brasDroiteX = mouvement < 2 ? x + 13 : x + 10;
        let brasGaucheY = mouvement < 2 ? y + 12 : y + 6;
        let brasDroiteY = mouvement < 2 ? y + 6 : y + 12;

        objC2D.fillStyle = couleurCorps;
        objC2D.fillRect(brasGaucheX, brasGaucheY, 5, 6);
        objC2D.fillRect(brasDroiteX, brasDroiteY, 5, 6);
    } else {
        // Position immobile
        objC2D.fillStyle = "white";
        objC2D.fillRect(x + 5, y + 24, 5, 10); // Jambe gauche
        objC2D.fillRect(x + 10, y + 24, 5, 10); // Jambe droite

        objC2D.fillStyle = couleurCorps;
        objC2D.fillRect(x + 2, y + 10, 5, 6); // Bras gauche
        objC2D.fillRect(x + 13, y + 10, 5, 6); // Bras droit
    }

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
    let strPointage = 'Score: ' + String(objStatJeu.score).padStart(7,'0');

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
    objGardes.forEach(garde => {
        dessinerPersonnage(garde.x, garde.y, garde.couleur);
    });
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


    objC2D.strokeStyle   = 'pink';
    objC2D.beginPath();
    objC2D.moveTo(-objJoueur.largeur/2 + objJoueur.largeur/2,-objJoueur.hauteur/2);
    objC2D.lineTo(-objJoueur.largeur/2 + objJoueur.largeur/2,objJoueur.hauteur/2);
    objC2D.stroke();

    objC2D.restore();
}




