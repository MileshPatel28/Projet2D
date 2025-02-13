
// rjeanjulien
// Importation d'autre fichier

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

    initJoueur();

    dessiner();
    animer();
}   

function initControlleurJeu(){
    objControlleurJeu = new Object();

    objControlleurJeu.cleHaut = false;
    // objControlleurJeu.cleBas = false;
    objControlleurJeu.cleGauche = false;
    objControlleurJeu.cleDroit = false;

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

function initCarteTuile(){
    objCarteTuile = new Object();
    
    let xDebutCarte = 25;
    let yDebutCarte = 25;
    let xFinCarte = objCanvas.width;
    let yFinCarte = objCanvas.height;

    
}


function initJoueur(){
    objJoueur = new Object();

    objJoueur.largeur = 100;
    objJoueur.hauteur = 200;

    objJoueur.positionX = 200;
    objJoueur.positionY = 400;

    objJoueur.vitesseY = 1;
    objJoueur.vitesseX = 1;
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
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = true;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = true;
})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = false;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = false;
})


// Joueur Logique

function miseAJourJoueur(){
    deplacementJoueur()
    graviteJoueur()
}


// Fonctionne plus ou moins (avant le mapping)
function deplacementJoueur(){
    if( objControlleurJeu.cleGauche &&
        objJoueur.positionX > 25 + objJoueur.largeur/2
    ){
        objJoueur.positionX -= objJoueur.vitesseX;
    }

    if( objControlleurJeu.cleDroit &&
        objJoueur.positionX < (objCanvas.width - 25)
    ){
        objJoueur.positionX += objJoueur.vitesseX;
    }
}

// A programmer
function graviteJoueur(){
    
    if(objJoueur.positionY < objMurs.tabMurs[2].yDebut){
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

    dessinerMurs();

    dessinerJoueur();

    objC2D.restore();
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

    objC2D.fillStyle = 'blue'
    objC2D.translate(
        objJoueur.positionX,
        objJoueur.positionY
    )

    objC2D.beginPath();
    objC2D.rect(
        -objJoueur.largeur/2,
        -objJoueur.hauteur/2,
        objJoueur.largeur/2,
        objJoueur.hauteur/2
    )
    objC2D.fill();

    objC2D.restore();
}