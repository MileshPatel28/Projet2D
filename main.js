// Branch Milesh
//
/**
 *  NOTE POUR PROJET
 *  Sur github, les contributions n'est pas representative de qui fait quoi. 
 *  On utilise un extension dont on peut modifier le même fichier en même temps.
 *  À la fin de chaque jour/session, je publie les modifications qui est fait sur mon PC.
 *  De cette façon, le projet se réalisera plus rapidement qu'avant.
 * 
 */

var objCanvas = null;
var objC2D = null;
var objCycleAnimation = null;

var objControlleurJeu = null;

var objMurs = null;
var objCarteTuile = null;

var objJoueur = null;



/**
 *  -----------------------
 *   Initialization du jeu
 *  -----------------------
 */


// Changer à cause du nomination
function initJeu(){
    // Pour débogger
    document.getElementById('monCanvas').style.outline = "thick solid rgb(0, 0, 0)";

    console.log('init animation v1');
    objCanvas = document.getElementById('monCanvas')
    objCanvas.focus();
    

    objC2D = objCanvas.getContext('2d');

    initControlleurJeu();

    initMurs();
    initCarteTuile();

    initJoueur();

    dessiner();
    animer();
}   

function initControlleurJeu(){
    objControlleurJeu = new Object();

    objControlleurJeu.cleHaut = false;
    objControlleurJeu.cleBas = false;
    objControlleurJeu.cleGauche = false;
    objControlleurJeu.cleDroit = false;

    objControlleurJeu.cleX = false;
    objControlleurJeu.cleZ = false;

}

function initMurs(){
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
function initCarteTuile(){
    objCarteTuile = new Object();
    
    objCarteTuile.xDebutCarte = 25;
    objCarteTuile.yDebutCarte = 25;
    objCarteTuile.xFinCarte = objCanvas.width;
    objCarteTuile.yFinCarte = objCanvas.height;

    objCarteTuile.xLargeurTuile = 50;
    objCarteTuile.yLargeurTuile = 50;

    objCarteTuile.tabTuile = []

    for(let x = 1; x <= objCarteTuile.xFinCarte/objCarteTuile.xLargeurTuile;x++){
        for(let y = 1; y <= objCarteTuile.yFinCarte/objCarteTuile.yLargeurTuile; y++){

            let tuileInsere = {tuileX: x, tuileY: y, type: 'V'}

            if(y >= objCarteTuile.yFinCarte/objCarteTuile.yLargeurTuile - 3){
                tuileInsere.type = 'B'
            }

            if(y == objCarteTuile.yFinCarte/objCarteTuile.yLargeurTuile - 4
                && x >= 1
            ){
                tuileInsere.type = 'P'
            }

            if(y == objCarteTuile.yFinCarte/objCarteTuile.yLargeurTuile - 6
                && x >= 6 && x <= 12
            ){
                tuileInsere.type = 'P'
            }

            if((y == 13 || y == 12) && x == 13){
                tuileInsere.type = 'E'
            }

            if(y == 13 && x == 16){
                tuileInsere.type = 'P'
            }

            if(y == 13 && x == 10){
                tuileInsere.type = 'P'
            }



            objCarteTuile.tabTuile.push(tuileInsere)
        }
    }

    
}


function initJoueur(){
    objJoueur = new Object();

    objJoueur.largeur = 50;
    objJoueur.hauteur = 50;

    objJoueur.positionX = objCanvas.width/2; // Changer a objCanvas.width/2
    objJoueur.positionY = 400;

    objJoueur.vitesseY = 2;
    objJoueur.vitesseX = 2;

    objJoueur.binTomber = true;
    objJoueur.tuileActive = {};

    objJoueur.binGrimpeEchelle = false;
}

/**
 *  ----------------------
 *  Fonction Préliminaire
 *  ----------------------
 */

function animer(){
    objCycleAnimation = requestAnimationFrame(animer);

    // Cycle d'animation
    effacerDessin();    
    mettreAjourAnimation();
    dessiner();
}

function arreterAnimation(){
    if (objCycleAnimation != null){
        cancelAnimationFrame(objCycleAnimation);
    }
    objCycleAnimation = null;
}

function effacerDessin(){
    objC2D.clearRect(0,0, objCanvas.width, objCanvas.height); 
}

/**
*  -----------------
*   Logique du jeu
*  -----------------
*/

function mettreAjourAnimation(){

    

    miseAJourJoueur();
}

// Évenement pour détecter les touches du utilisateur
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = true;
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = true;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = true;
    if (event.key == 'ArrowDown') objControlleurJeu.cleBas = true;
    if (event.key == 'X') objControlleurJeu.cleX = true;
    if (event.key == 'Z') objControlleurJeu.cleZ = true;
})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = false;
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = false;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = false;
    if (event.key == 'ArrowDown') objControlleurJeu.cleBas = false;
    if (event.key == 'X') objControlleurJeu.cleX = false;
    if (event.key == 'Z') objControlleurJeu.cleZ = false;
})


// Joueur Logique

function miseAJourJoueur(){
    deplacementJoueur()
    graviteJoueur()
}


// On doit completmenet le revamp 
function deplacementJoueur(){

    let binDeplacementGauche = false;
    let binDeplacementDroite = false;
    let binDeplacementHaut = false;
    let binDeplacementBas = false;

    if(!objJoueur.binTomber){

        objJoueur.tuileActive = {}

        let tuileEntourage = []

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
            tuileEntourage = objCarteTuile.tabTuile.filter(tuile => 
                tuile.tuileX >= objJoueur.tuileActive.tuileX - 1 && tuile.tuileX <= objJoueur.tuileActive.tuileX + 1 &&
                tuile.tuileY >= objJoueur.tuileActive.tuileY - 1 && tuile.tuileY <= objJoueur.tuileActive.tuileY + 1
            )
        }



        // ===== Deplacement Horizontal ===== 
    
        if(objControlleurJeu.cleGauche &&
           objJoueur.positionX > 25 + objJoueur.largeur/2){

            let tuileGauche = tuileEntourage.find(
                (tuile) => 
                    tuile.tuileX == objJoueur.tuileActive.tuileX - 1 &&
                    tuile.tuileY == objJoueur.tuileActive.tuileY
            )

            if( tuileGauche && 
                tuileGauche.type != 'V' && 
                tuileGauche.type != 'E' &&
                !((objJoueur.positionX - objJoueur.largeur/2) > (tuileGauche.tuileX+1)*objCarteTuile.xLargeurTuile)
            ){
                binDeplacementGauche = false;
            }
            else{
                binDeplacementGauche = true;
            }

        }

        if(objControlleurJeu.cleDroit &&
            objJoueur.positionX < 25 + objCanvas.width - 25){
 
             let tuileDroit = tuileEntourage.find(
                 (tuile) => 
                     tuile.tuileX == objJoueur.tuileActive.tuileX + 1 &&
                     tuile.tuileY == objJoueur.tuileActive.tuileY
             )
 

             if( tuileDroit &&
                 tuileDroit.type != 'V' && 
                 tuileDroit.type != 'E' &&
                 !((objJoueur.positionX + objJoueur.largeur/2) < tuileDroit.tuileX*objCarteTuile.xLargeurTuile)
             ){
                 binDeplacementDroite = false;
             }
             else{
                binDeplacementDroite = true;
             }
            
             
         }

         let tuileEnBas = tuileEntourage.find(
            (tuile) => 
                tuile.tuileX == objJoueur.tuileActive.tuileX &&
                tuile.tuileY == objJoueur.tuileActive.tuileY + 1
        )

        // Deplacement vertical
        if(
            (objJoueur.tuileActive.type == 'E') ||
            (tuileEnBas && tuileEnBas.type == 'E')
        ){
            
            if((tuileEnBas && tuileEnBas.type == 'E') && !(objJoueur.tuileActive.type == 'E')){
                objJoueur.binGrimpeEchelle = false;
            }

            if(objJoueur.binGrimpeEchelle){
                binDeplacementGauche = false;
                binDeplacementDroite = false;
            }

            if(objControlleurJeu.cleHaut){
                binDeplacementHaut = true;
                objJoueur.binGrimpeEchelle = true;
            }

            console.log(objJoueur.positionY + objJoueur.hauteur/2 + "??" + tuileEnBas.tuileY * objCarteTuile.yLargeurTuile)

            if( objControlleurJeu.cleBas && 
                (tuileEnBas && tuileEnBas.type == 'E' ||
                 objJoueur.positionY + objJoueur.hauteur/2 <= tuileEnBas.tuileY * objCarteTuile.yLargeurTuile)
            ){
                binDeplacementBas = true;
                objJoueur.binGrimpeEchelle = true;
            }


        }
    }
    else{
        binDeplacementGauche = false;
        binDeplacementDroite = false;
    }


    if(binDeplacementHaut){
        objJoueur.positionY -= objJoueur.vitesseY
    }

    if(binDeplacementBas){
        objJoueur.positionY += objJoueur.vitesseY
    }

    if(binDeplacementGauche){
        objJoueur.positionX -= objJoueur.vitesseX;
    }

    if(binDeplacementDroite){
        objJoueur.positionX += objJoueur.vitesseX;
    }

    if(objJoueur.binGrimpeEchelle){
        objJoueur.positionX = (objJoueur.tuileActive.tuileX * objCarteTuile.xLargeurTuile + objJoueur.largeur/4)
    }
    
}

// A programmer
function graviteJoueur(){
    
    let binDescend = true;

    let positionYFinale = objJoueur.positionY + objJoueur.vitesseY + objJoueur.hauteur / 2;
    let positionXFinale = objJoueur.positionX;

    if(!(objJoueur.positionY < objMurs.tabMurs[2].yDebut)){
        binDescend = false;
    }

    let tuileBas = {}


    objCarteTuile.tabTuile.forEach((tuile) => {
        if(binDescend && tuile.type != 'V'){
            if( (positionYFinale >= (tuile.tuileY)*objCarteTuile.yLargeurTuile 
                && positionYFinale <= (tuile.tuileY + 1)*objCarteTuile.yLargeurTuile)
                && (positionXFinale + objJoueur.largeur/2 >= (tuile.tuileX)*objCarteTuile.xLargeurTuile
                && positionXFinale - objJoueur.largeur/2  <= (tuile.tuileX + 1)*objCarteTuile.xLargeurTuile)
            ){
                binDescend = false;
                tuileBas = tuile;
            }
        }
    })
    

    objJoueur.binTomber = binDescend;


    if(binDescend){
        objJoueur.positionY += objJoueur.vitesseY;
    }
    
}


/**
 * -----------------
 *  Dessinage du jeu
 * ------------- ---
 */

function dessiner(){
    objC2D.save();


    dessinerTuiles();

    dessinerMurs();

    dessinerJoueur();

    objC2D.restore();
}

// Incomplet
function dessinerTuiles(){
    objC2D.save();

    objC2D.translate(
        -25,
        -25
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

function dessinerUnTuile(strType){
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

    if(strType == 'B'){
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
            objCarteTuile.xLargeurTuile - padTuile*2,
            objCarteTuile.yLargeurTuile - padTuile*2
        )
        objC2D.fill();
    }
    else if(strType == 'P'){

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
            objCarteTuile.xLargeurTuile/2 - padBrique,
            objCarteTuile.yLargeurTuile/2 - padBrique
        )
        objC2D.fill();

        objC2D.beginPath();
        objC2D.rect(
            objCarteTuile.xLargeurTuile/2 + padBrique,
            padBrique,
            objCarteTuile.xLargeurTuile/2 - padBrique*2,
            objCarteTuile.yLargeurTuile/2 - padBrique
        )
        objC2D.fill();

        objC2D.beginPath();
        objC2D.rect(
            padBrique,
            objCarteTuile.yLargeurTuile/2 + padBrique,
            objCarteTuile.xLargeurTuile - padBrique*2,
            objCarteTuile.yLargeurTuile/2 - padBrique*2
        )
        objC2D.fill();
    }
    else if(strType == 'E'){
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
        for(let i = 5; i < objCarteTuile.yLargeurTuile; i += 7){
            objC2D.beginPath();
            objC2D.moveTo(0,i);
            objC2D.lineTo(objCarteTuile.xLargeurTuile,i);
            objC2D.stroke();
        }


    }

}


function dessinerMurs(){
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
}



function dessinerJoueur(){
    objC2D.save();

    objC2D.translate(
        -25,
        -25
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


    // Debug
    objC2D.beginPath();
    objC2D.arc(0, 0, 5, 0, 2 * Math.PI);
    objC2D.fillStyle = "red";
    objC2D.fill();
    objC2D.lineWidth = 4;
    objC2D.strokeStyle = "blue";
    objC2D.stroke();

}


