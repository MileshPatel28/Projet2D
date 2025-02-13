// Changement 1
// rjeanjulien
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

// Initialize un carte de tuile vide, Il faut encore le peupler avec divers type
// De plus, le carte de tuile peut seulement dessiner des tuiles vide il faut encore mettre en place 
// le code pour les tuiles non vide
function initCarteTuile(){
    objCarteTuile = new Object();
    
    objCarteTuile.xDebutCarte = 25;
    objCarteTuile.yDebutCarte = 25;
    objCarteTuile.xFinCarte = objCanvas.width;
    objCarteTuile.yFinCarte = objCanvas.height;

    objCarteTuile.xLargeurTuile = 50;
    objCarteTuile.yLargeurTuile = 50;

    objCarteTuile.tabTuile = []

    for(let i = 1; i <= objCarteTuile.xFinCarte/objCarteTuile.xLargeurTuile;i++){
        for(let j = 1; j <= objCarteTuile.yFinCarte/objCarteTuile.yLargeurTuile; j++){
            objCarteTuile.tabTuile.push(
                {tuileX: i, tuileY: j, type: 'vide'}
            )
        }
    }


    console.log(objCarteTuile.tabTuile)
    
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
        objC2D.fillStyle = `rgb(${Math.random() * 255}, 
            ${Math.random() * 255}, 
            ${Math.random() * 255})`;

        if(tuile.type == 'vide'){
            objC2D.fillStyle = 'rgb(0,0,0)';
        }

        objC2D.beginPath();
        objC2D.rect(
            tuile.tuileX * objCarteTuile.xLargeurTuile,
            tuile.tuileY * objCarteTuile.yLargeurTuile,
            (tuile.tuileX + 1) * objCarteTuile.xLargeurTuile,
            (tuile.tuileY + 1) * objCarteTuile.yLargeurTuile
        );
        objC2D.fill();
    })

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