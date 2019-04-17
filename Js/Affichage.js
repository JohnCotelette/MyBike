/* Une feuille qui permet d'instancier un item possedant des methodes qui s'occuperont de l'affichage (par consequent, on joue beaucoup avec les styles CSS) */

/* ---------------------------------------------------------------------------- */

/* LA CLASSE "GestionnaireAffichage" */
class GestionnaireAffichage {
	constructor() { // Beaucoup de selecteurs ici
		this.blocGauche = document.getElementById("blocgauche");
		this.blocDroite = document.getElementById("blocdroite");
		this.blocReservation = document.getElementById("reservation");
		this.blocConfirmation = document.getElementById("confirmation");
		this.nomStation = document.getElementById("nomstation");
		this.nbrVelosDispo = document.getElementById("nombrevelosdisponibles");
		this.nbrPlacesDispo = document.getElementById("nombreplacesdisponibles");
		this.adresseStation = document.getElementById("adressestation");
		this.formulaireResa = document.getElementById("formulaire");
		this.statutStation = document.getElementById("statutstation");
		this.blocSignature = document.getElementById("signature");
		this.titreBlocReCap = document.getElementById("recapitulatif");
		this.blocRecap = document.getElementById("messagerecapitulatif");
		this.nomReservant = document.getElementById("nomreservant");
		this.nomStationRecap = document.getElementById("nomstation2");
		this.messageConfirmation = document.getElementById("messageconfirmation");
		this.boutonAnnulerReservation = document.getElementById("boutonannulerreservation");
		this.indicateurReservation = document.getElementById("indicReservation");
		this.compteur = document.getElementById("compteur");

		this.velosDisponibles = null;
		this.possibleReservation = null; // Par defaut, un boleen qui rend possible la reservation en fonction du nombre de velos et de l'etat d'ouverture de la station

		this.ecouteurClicStation = document.addEventListener("clicMarqueur", (e) => { // Un ecouteur integre reactif a chaque clic sur une station
			this.remplissageDonneesFormulaire(e.detail);
			this.disparitionSignature();
			this.disparitionConfirmation();
			this.apparitionFormulaire();
			this.refreshAffichage();
		});

		this.ecouteurClicFormulaire = document.addEventListener("clicFormulaire", (e) => { // Un ecouteur integre reactif a chaque validation du formulaire
			this.apparitionSignature();
			this.refreshAffichage();
		});

		this.ecouteurNouvelleReservation = document.addEventListener("nouvelleReservation", (e) => { // Un ecouteur integre reactif a chaque nouvelle reservation
			this.apparitionConfirmation();
			this.refreshAffichage();
		});

		this.ecouteurNouvelleAnnulation = document.addEventListener("nouvelleAnnulation", (e) => { // Un ecouteur integre reactif a chaque nouvelle annulation
			this.disparitionConfirmation();
			this.refreshAffichage();
		});
	};

	initAffichage() { // Methode qui permet de maintenir l'affichage du bloc de confirmation dans le cas d'un rechargement de page et si une reservation est enregistree
		this.nomStationRecap.textContent = localStorage.getItem("nomStation");
		this.nomReservant.textContent = localStorage.getItem("prenom") + " " + localStorage.getItem("nom");
		if (localStorage.reservationEnCours == 1) { // Le bloc confirmation reste visible meme apres un rechargement
			this.titreBlocReCap.classList.remove("invisible");
			this.blocRecap.classList.remove("invisible");
		};
	};

	refreshAffichage() {
		if (localStorage.reservationEnCours == 1 && localStorage.nomStation === this.nomStation.textContent) {
			this.nbrVelosDispo.textContent = this.velosDisponibles - 1;
			this.indicateurReservation.classList.remove("invisible");
		} else if (localStorage.reservationEnCours == 0 && localStorage.nomStation === this.nomStation.textContent) {
			this.nbrVelosDispo.textContent = this.velosDisponibles;
			this.indicateurReservation.classList.add("invisible");
		} else {
			this.indicateurReservation.classList.add("invisible");
		};
	};

	remplissageDonneesFormulaire(donneesClic) { // Methode pour injecter les donnees relatives a la station selectionnee dans le corps de page
		this.velosDisponibles = donneesClic.velosDispos;
		this.nbrVelosDispo.textContent = donneesClic.velosDispos;
		this.nomStation.textContent = donneesClic.nomStation;
		this.nbrPlacesDispo.textContent = donneesClic.placesDispo;
		this.adresseStation.textContent = donneesClic.adresseStation;
		this.formulaireResa.nom.value = localStorage.getItem("nom");
		this.formulaireResa.prenom.value = localStorage.getItem("prenom");

		if ((donneesClic.statutStation === "OPEN") && (donneesClic.velosDispos > 0)) { // Si la station est ouverte et qu'il y a au moins 1 vélo : l'autorisation vaut "true"
			this.statutStation.textContent = "STATION OUVERTE";
			this.statutStation.style.color = "#4fdabf";
			this.formulaireResa.style.display = "inline";
			this.possibleReservation = true;
		} else if ((donneesClic.statutStation === "OPEN") && (donneesClic.velosDispos === 0)) { // Si la station est ouverte mais qu'il n'y a pas de vélo disponible, l'autorisation vaut "false"
			this.statutStation.textContent = "AUCUN VELO DISPONIBLE";
			this.statutStation.style.color = "red";
			this.formulaireResa.style.display = "none";
			this.possibleReservation = false;
		} else {
			this.statutStation.textContent = "STATION FERMEE"; // Toute autre possibilité signifierait que la station est close, l'autorisation vaut donc "false"
			this.statutStation.style.color = "red";
			this.formulaireResa.style.display = "none";
			this.possibleReservation = false;
		};
	};

	apparitionFormulaire() {
		if (window.matchMedia("(min-width: 821px)").matches) {
		  	this.blocGauche.style.width = "62%";
			this.blocGauche.style.marginRight = "4%";
			this.blocDroite.style.width = "34%";
			this.blocReservation.classList.remove("invisible");
			} else if (window.matchMedia("(max-width: 820px)").matches) {
				window.scrollTo(0, 1200);
				this.blocReservation.classList.remove("invisible");
			} else {
				this.blocReservation.classList.remove("invisible");
			};

		this.formulaireResa.addEventListener("submit", (e) => {
			e.preventDefault(); // On veut gerer les donnees nous meme, l'event "submit" doit donc etre depourvu de ses consequences originales
			if (this.possibleReservation = true) { // Si ce parametre vaut "true", alors...
				dieu.newGestionnaireAffichage.apparitionSignature();
				if (window.matchMedia("(max-width: 820px)").matches) {
					window.scrollTo(0, 1500);
				}; 
			} else { // S'il vaut "false" alors...
					dieu.newGestionnaireAffichage.blocSignature.style.display = "none";
			};
		});
	};

	apparitionSignature() {
		this.blocSignature.style.display = "flex";
	};

	disparitionSignature() {
		this.blocSignature.style.display = "none";
	};

	apparitionConfirmation() { // En cas de nouvelle reservation, cette methode va gerer l'affichage des blocs de confirmation avec le recapitulatif
		this.titreBlocReCap.classList.remove("invisible");
		this.blocRecap.classList.remove("invisible");
		this.blocConfirmation.classList.remove("invisible");
		this.messageConfirmation.textContent = "VOTRE VELO A BIEN ETE RESERVE !";
		this.nomStationRecap.textContent = localStorage.getItem("nomStation");
		this.nomReservant.textContent = localStorage.getItem("prenom") + " " + localStorage.getItem("nom");

		if (window.matchMedia("(max-width: 820px)").matches) {
				window.scrollTo(0, 1600);
		};
	};

	disparitionConfirmation() { // En cas d'annulation, cette methode va gerer l'affichage la disparition des blocs et le message de confirmation d'annulation
		this.disparitionSignature();
		if (localStorage.reservationEnCours == 0) {
			this.messageConfirmation.textContent = "VOTRE RESERVATION A BIEN ETE ANNULEE, A BIENTOT !"
			this.boutonAnnulerReservation.classList.add("invisible");
			this.titreBlocReCap.classList.add("invisible");
			this.blocRecap.classList.add("invisible");
			setTimeout(() => {
				this.blocConfirmation.classList.add("invisible");
			}, 2000);
		} else {
			this.blocConfirmation.classList.add("invisible");
		};
	};
};