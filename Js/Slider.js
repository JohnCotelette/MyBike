/* Le principe du slider va reposer sur un concept assez simple : modifier le style "display" des 4 slides ("none/block")
Par defaut, on aurait pu rendre invisibles toutes les images et les faire apparaitre ensuite, mais si on desactive Javascript, il est pertinent d'en converser une
Les deux points forts de ce code sont les suivants : 
1. On peut tres facilement changer la duree de slide entre deux images en modifiant la valeur stockee dans le parametre "vitesse" de la classe "Slider"
2. Le code s'adaptera aux ajouts/suppressions ulterieur(e)s d'images dans le code HTML. Il faudra cependant ajouter/supprimer une autre bulle de statut dans le code HTML. */

/* ---------------------------------------------------------------------------- */

/* LA CLASSE "SLIDER" CONTIENT NOS SELECTEURS ET NOS METHODES POUR GERER L'AFFICHAGE, L'INDEX ET LES EVENTS */
class Slider {
	constructor() {
		this.gauche = document.getElementById("boutongauche");
		this.droite = document.getElementById("boutondroite");
		this.pause = document.getElementById("pause");
		this.play = document.getElementById("play");
		this.images = document.querySelectorAll(".photosslider");
		this.bulles = document.querySelectorAll(".cercles");
		
		this.slideAuto = null;
		this.imageActuelle = 0;
		this.vitesse = 5000;
	};

	reset() { // Methode essentielle pour reinitialiser l'affichage et pour en conserver une si le script n'est pas chargé ou si Javascript est desactive
		for (let i = 0; i < this.images.length; i++) {
			this.images[i].classList.add("invisible");
			this.bulles[i].style.backgroundColor = "grey";
		};
		if (this.imageActuelle === this.images.length) {
			this.imageActuelle = 0;
		};
		if (this.imageActuelle === -1) {
			this.imageActuelle = this.images.length - 1;
		};
		this.affichage();
	};

	affichage() {
		this.images[this.imageActuelle].classList.remove("invisible");
		this.bulles[this.imageActuelle].style.backgroundColor = "#4fdabf";
	};

	rightSlide() { // Methode pour aller à droite
		this.imageActuelle++;
		this.reset();
	};

	leftSlide() { // Methode pour aller à gauche
		this.imageActuelle--;
		this.reset();
	};

	clavierSlide(e) { // Methode qui traite des touches clavier
		if (e.key === "ArrowLeft") { // La technique avec les "e.keycode" etant obsolete, on utilisera cette facon de faire
		this.leftSlide();
		} else if (e.key === "ArrowRight") {
		this.rightSlide();
		}
	};

	playSlide() { // Methode pour le bouton play
		this.play.classList.add("invisible");
		this.pause.classList.remove("invisible");
		this.slideAuto = setInterval(this.rightSlide.bind(this), this.vitesse);
	};

	pauseSlide() { // Methode pour le bouton pause
		this.pause.classList.add("invisible");
		this.play.classList.remove("invisible");
		clearInterval(this.slideAuto);
	};

	initControles() { // Methode pour tous les evenements possibles (4 boutons + les deux touches de clavier)
		this.droite.addEventListener("click", this.rightSlide.bind(this)); // La methode "bind()" sera notre copine ici pour le principe de la POO (redefinir "this" dans le contexte de la classe et non dans celui de l'event)
		this.gauche.addEventListener("click", this.leftSlide.bind(this));
		this.play.addEventListener("click", this.playSlide.bind(this));
		this.pause.addEventListener("click", this.pauseSlide.bind(this));
		document.addEventListener("keydown", this.clavierSlide.bind(this));
		this.slideAuto = setInterval(this.rightSlide.bind(this), this.vitesse);
	};
};