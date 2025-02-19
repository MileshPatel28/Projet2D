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
function initCarteTuile() {
    objCarteTuile = new Object();

    objCarteTuile.xDebutCarte = 25;
    objCarteTuile.yDebutCarte = 25;
    objCarteTuile.xFinCarte = objCanvas.width;
    objCarteTuile.yFinCarte = objCanvas.height;

    objCarteTuile.xLargeurTuile = 50;
    objCarteTuile.yLargeurTuile = 50;

    objCarteTuile.tabTuile = []

    for (let i = 1; i <= objCarteTuile.xFinCarte / objCarteTuile.xLargeurTuile; i++) {
        for (let j = 1; j <= objCarteTuile.yFinCarte / objCarteTuile.yLargeurTuile; j++) {

            let tuileInsere = { tuileX: i, tuileY: j, type: 'V' }

            if (j >= objCarteTuile.yFinCarte / objCarteTuile.yLargeurTuile - 3) {
                tuileInsere.type = 'B'
            }

            if (j == objCarteTuile.yFinCarte / objCarteTuile.yLargeurTuile - 4
                && i >= 2
            ) {
                tuileInsere.type = 'P'
            }

            if (j == objCarteTuile.yFinCarte / objCarteTuile.yLargeurTuile - 6
                && i >= 6 && i <= 12
            ) {
                tuileInsere.type = 'P'
            }

            if ((j == 13 || j == 12) && i == 5) {
                tuileInsere.type = 'E'
            }

            if ((j == 13 || j == 12) && i == 15) {
                tuileInsere.type = 'E'
            }

            objCarteTuile.tabTuile.push(tuileInsere)
        }
    }


}


function initJoueur() {
    objJoueur = new Object();

    objJoueur.largeur = 20;
    objJoueur.hauteur = 50;

    // Hauteur d'une brique (50 pixels) et son niveau (4e rangée)
    let hauteurBrique = 50;
    let niveauBrique = 4; // La 4e rangée depuis le bas

    objJoueur.positionX = 200;
    objJoueur.positionY = objCanvas.height - (niveauBrique * hauteurBrique);

    objJoueur.vitesseY = 2;
    objJoueur.vitesseX = 2;

    objJoueur.binTomber = true;
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

    miseAJourJoueur();
}

// Évenement pour détecter les touches du utilisateur
document.addEventListener('keydown', (event) => {
    if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = true;
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = true;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = true;
    if (event.key == 'ArrowDown') objControlleurJeu.cleBas = true;
})

document.addEventListener('keyup', (event) => {
    if (event.key == 'ArrowUp') objControlleurJeu.cleHaut = false;
    if (event.key == 'ArrowLeft') objControlleurJeu.cleGauche = false;
    if (event.key == 'ArrowRight') objControlleurJeu.cleDroit = false;
    if (event.key == 'ArrowDown') objControlleurJeu.cleBas = false;
})


// Joueur Logique

function miseAJourJoueur() {
    deplacementJoueur()
    deplacerGardes();
    graviteJoueur()
}


// Fonctionne plus ou moins (avant le mapping)
function deplacementJoueur() {

    let binDeplacementGauche = true;
    let binDeplacementDroite = true;
    let binDeplacementHaut = false;
    let binDeplacementBas = false;

    if (!objJoueur.binTomber) {

        let tuileActive = {}

        objCarteTuile.tabTuile.forEach((tuile) => {
            if (objJoueur.positionX >= tuile.tuileX * objCarteTuile.xLargeurTuile
                && objJoueur.positionX <= (tuile.tuileX + 1) * objCarteTuile.xLargeurTuile
                && objJoueur.positionY >= tuile.tuileY * objCarteTuile.yLargeurTuile
                && objJoueur.positionY <= (tuile.tuileY + 1) * objCarteTuile.yLargeurTuile
            ) {

            }
        })


        if (!(objControlleurJeu.cleGauche &&
            objJoueur.positionX > 25 + objJoueur.largeur / 2)
        ) {
            binDeplacementGauche = false;
        }

        if (!(objControlleurJeu.cleDroit &&
            objJoueur.positionX < (objCanvas.width - 25))
        ) {
            binDeplacementDroite = false;
        }

        // Determiner si le joueur peut interagir avec un echelle

        let binSurEchelle = false;

        let tuileBasX = -1;
        let tuileBasY = -1;

        objCarteTuile.tabTuile.forEach((tuile) => {
            if (tuile.type == 'E') {


                if (objJoueur.positionX >= tuile.tuileX * objCarteTuile.xLargeurTuile - objCarteTuile.xLargeurTuile / 2
                    && objJoueur.positionX <= (tuile.tuileX + 1) * objCarteTuile.xLargeurTuile + objCarteTuile.xLargeurTuile / 2
                ) {
                    binSurEchelle = true;

                    tuileBasX = tuile.tuileX;
                    tuileBasY = tuile.tuileY + 1;
                }
            }
        })

        if (binSurEchelle && objControlleurJeu.cleHaut) {
            binDeplacementHaut = true;
        }


        let positionFinaleYBas = objJoueur.positionY + objJoueur.vitesseY + objCarteTuile.yLargeurTuile / 2

        if (binSurEchelle
            && objControlleurJeu.cleBas
            && positionFinaleYBas <= tuileBasY * objCarteTuile.yLargeurTuile
        ) {
            binDeplacementBas = true;
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
}

// A programmer
function graviteJoueur() {

    let binDescend = true;

    let positionYFinale = objJoueur.positionY + objJoueur.vitesseY + objCarteTuile.yLargeurTuile / 2
    let positionXFinale = objJoueur.positionX;

    if (!(objJoueur.positionY < objMurs.tabMurs[2].yDebut)) {
        binDescend = false;
    }

    objCarteTuile.tabTuile.forEach((tuile) => {
        if (tuile.type != 'V') {
            if ((positionYFinale >= (tuile.tuileY) * objCarteTuile.yLargeurTuile
                && positionYFinale <= (tuile.tuileY + 1) * objCarteTuile.yLargeurTuile)
                && (positionXFinale + objCarteTuile.xLargeurTuile / 2 >= (tuile.tuileX) * objCarteTuile.xLargeurTuile
                    && positionXFinale - objCarteTuile.xLargeurTuile / 2 <= (tuile.tuileX + 1) * objCarteTuile.xLargeurTuile)
            ) {
                binDescend = false;
            }
        }
    })

    objJoueur.binTomber = binDescend;

    if (binDescend) {
        objJoueur.positionY += objJoueur.vitesseY;
    }


}


/**
 * -----------------
 *  Dessinage du jeu
 * ------------- ---
 */

function dessiner() {
    objC2D.save();

    // Dessiner l'environnement
    dessinerTuiles();
    dessinerMurs();

    // Déplacer les gardes avant de les dessiner
    deplacerGardes();

    // Détecter si le joueur est en mouvement
    mettreAjourAnimation();

    // Dessin animation des joueurs
    let frame = Math.floor(performance.now() / 100 % 4);

    let joueurs = [
        { x: 150, y: 200, couleur: "red" },
        { x: 250, y: 200, couleur: "green" },
        { x: 350, y: 200, couleur: "purple" }
    ];

    joueurs.forEach(joueur => {
        dessinerJoueur(frame, joueur.couleur, joueur.x, joueur.y);
    });

    // Dessiner les gardes après mise à jour
    dessinerGardes();

    // Dessiner les lingots d'or
    dessinerLingots(100, 150);
    dessinerLingots(200, 250);
    dessinerLingots(300, 350);

    objC2D.restore();
}

// Incomplet
function dessinerTuiles() {
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

function dessinerUnTuile(strType) {
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
    else if (strType == 'P') {

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
    else if (strType == 'E') {
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
        for (let i = 5; i < objCarteTuile.yLargeurTuile; i += 7) {
            objC2D.beginPath();
            objC2D.moveTo(0, i);
            objC2D.lineTo(objCarteTuile.xLargeurTuile, i);
            objC2D.stroke();
        }


    }

}


function dessinerMurs() {
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

function dessinerJoueur(frame, couleurCorps) {
    objC2D.save();

    let x = objJoueur.positionX;
    let y = objJoueur.positionY;

    // Définitiion de la couleur de la tenue du personnage
    objC2D.fillStyle = couleurCorps || "red";

    // Corps (inclut bras et tronc)
    objC2D.fillRect(x + 4, y + 8, 12, 16);

    // Tête (avec casque jaune)
    objC2D.fillStyle = "#FFA500"; // Jaune orangé
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

// Fonction principale d'animation
function animer() {
    objCycleAnimation = requestAnimationFrame(animer);
    effacerDessin();
    deplacerGardes();
    dessiner();
}

/*function dessinerJoueur(frame) {
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
}*/



function dessinerLingots(x, y) {
    objC2D.save();

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

