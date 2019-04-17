/* On retrouve dans cette feuille une classe permettant la creation d'un objet pouvant s'occuper de la gestion des differentes etapes de la reservation
L'application imposant l'utilisation du "localStorage", il etait necessaire d'y integrer une methode permettant d'initialiser au prealable ce dernier (sans ecraser les valeurs initiales en cas de reutilisation) */

/* ---------------------------------------------------------------------------- */

/* UNE CLASSE POUR CREER UN OBJET CAPABLE DE GERER LA RESERVATION */
class GestionnaireDonneesReservation {
	constructor() {
		this.formulaireResa = document.getElementById("formulaire");
		this.boutonConfirmerResa = document.getElementById("boutoncanvasconfirmer");
		this.boutonAnnulerReservation = document.getElementById("boutonannulerreservation");
		this.titreBlocReCap = document.getElementById("recapitulatif");
		this.blocRecap = document.getElementById("messagerecapitulatif");
		this.compteur = document.getElementById("compteur");

		this.nomStation = document.getElementById("nomstation");
		this.nomReservant = localStorage.getItem("nom"); // Recuperation des donnees en provenance du "locaStorage" pour initialiser l'application
		this.prenomReservant = localStorage.getItem("prenom");
		this.reservationEnCours = localStorage.getItem("reservationEnCours");
		this.minutes = localStorage.getItem("minutes");
		this.secondes = localStorage.getItem("secondes");
		this.chrono = null;

		this.ecouteurUltimeCheckReponse = document.addEventListener("ultimeCheckReponse", (e) => { // Un ecouteur integre qui ecoute la reponse du last check de velos
			this.checkTest(e.detail);
		});
	};

	initReservationApp() { // Methode qui permet de fixer les valeurs stockees dans le "localStorage" lors de la premiere utilisation de l'application
		if (localStorage.reservationEnCours === undefined) { // Si l'utilisateur n'a jamais utilise l'application, la valeur sera "undefined"
			this.reservationEnCours = 0;
			this.minutes = 20;
			this.secondes = 0;
			localStorage.setItem("reservationEnCours", this.reservationEnCours);
			localStorage.setItem("minutes", this.minutes);
			localStorage.setItem("secondes", this.secondes);
		} else if (localStorage.reservationEnCours == 1) {
			this.chrono = setInterval(() => { // Le chrono reprend la ou il en etait dans le cas d'un rechargement alors qu'une reservation est enregistree
			this.chronometre();
			}, 1000);
		};
		this.lastCheckVelos() // On verifie avec l'appel a cette methode s'il reste toujours bien un velo au moins
	};

	lastCheckVelos() { // Methode pour verifier s'il y a encore un velos au dernier moment
		this.boutonConfirmerResa.addEventListener("click", (e) => {
			var ultimeCheckAPI = new CustomEvent("ultimeCheckAPI", {}); // Un autre custom event pour communiquer avec la classe "GestionnaireDonneesStations" pour un ultime check des velos disponibles
			document.dispatchEvent(ultimeCheckAPI);
		});
	};

	checkTest(lastCheckReponse) { // Methode qui organise la suite de l'application en fonction des donnees du localStorage
		if (localStorage.reservationEnCours == 0 && lastCheckReponse === "oui") {
			this.sauvegardeReservation();
		} else if (lastCheckReponse === "non") {
			alert("Oh, nous sommes désolés, il semble que pendant votre réservation, le dernier vélo de cette station ait été loué, n'hésitez pas a choisir une autre station !");
		} else {
			var confirmationEcrasage = window.confirm(`Votre navigateur nous informe que vous avez déjà effectué une réservation au nom de "${localStorage.getItem("prenom")} ${localStorage.getItem("nom")} a la station ${localStorage.getItem("nomStation")}". Cette nouvelle reservation ecrasera l'ancienne.`);
			if (confirmationEcrasage) { // Si l'utilisateur confirme, on lancera la sauvegarde de la reservation
				this.sauvegardeReservation();
			};
		};
	};

	sauvegardeReservation() { // Methode pour sauvegarder les donnees de reservation
		var regexp = /^\S*$/ // Pour eviter les formulaires remplis avec les espaces
		var regexp2 = /^[a-zA-Z-]{3,20}$/; // Pour imposer une taille limite entre chaque champ
		if (regexp.test(this.formulaireResa.nom.value) && regexp.test(this.formulaireResa.prenom.value) && regexp2.test(this.formulaireResa.nom.value) && regexp2.test(this.formulaireResa.prenom.value)) { // On teste les informations avec le regexp
			this.resetChronometre();
			this.nomReservant = this.formulaireResa.nom.value;
			this.prenomReservant = this.formulaireResa.prenom.value;
			this.reservationEnCours = 1;
			localStorage.setItem("nom", this.nomReservant); // On "capture" toutes les informations utiles a la sauvegarde
			localStorage.setItem("prenom", this.prenomReservant);
			localStorage.setItem("nomStation", this.nomStation.textContent);
			localStorage.setItem("reservationEnCours", this.reservationEnCours);
			this.chrono = setInterval(() => { // On lance ce maudit chrono !
				this.chronometre();
				}, 1000);
			var nouvelleReservation = new CustomEvent("nouvelleReservation", {detail: localStorage}); // Un autre custom event pour communiquer avec la classe affichage
			document.dispatchEvent(nouvelleReservation);
			this.annulerReservation(); // Pour offrir a chaque reservation la possibilite d'annuler
		} else { // Autrement, on avertit l'utilisateur qu'il doit correctement remplir le formulaire pour effectuer sa reservation
			alert("N'utilisez pas d'espaces, ni trop de caractères spéciaux, et renseignez entre 3 et 20 caractère(s) pour chacun des champs du formulaire !");
		};
	};

	annulerReservation() { // Methode pour annuler la reservation
		this.boutonAnnulerReservation.classList.remove("invisible");
		this.boutonAnnulerReservation.addEventListener("click", (e) => {
			this.reservationEnCours = 0; // La valeur de ce parametre retombe a 0;
			localStorage.setItem("reservationEnCours", this.reservationEnCours); // Idem pour le localStorage
			this.resetChronometre(); // Le chrono est reset
			var nouvelleAnnulation = new CustomEvent("nouvelleAnnulation", {});
			document.dispatchEvent(nouvelleAnnulation);
		});
	};

	chronometre() { // Methode pour le chronometre
		this.minutes = localStorage.getItem("minutes");
		this.secondes = localStorage.getItem("secondes");
		this.compteur.textContent = `${this.minutes} minutes et ${this.secondes} secondes`;
		if (this.minutes == 0 && this.secondes == 0) {
			this.compteur.textContent = "Temps écoulé, veuillez s'il vous plait effectuer une nouvelle réservation";
			clearInterval(this.chrono);
			this.resetChronometre();
			this.reservationEnCours = 0;
			localStorage.setItem("reservationEnCours", 0); // Une reservation qui atteint sa duree limite disparait du "localStorage"
		} else if (this.secondes == 0) {
			this.secondes = 59;
			this.minutes--;
		} else {
			this.secondes--;
		};
		localStorage.setItem("minutes", this.minutes); // On envoie l'etat tel quel du compteur dans le "localStorage" pour prevoir la fermeture et la reouverture du navigateur
		localStorage.setItem("secondes", this.secondes);
	};

	resetChronometre() { // Une methode pour remettre "a 0" le chronometre
		this.minutes = 20;
		this.secondes = 0;
		clearInterval(this.chrono);
		localStorage.setItem("minutes", this.minutes);
		localStorage.setItem("secondes", this.secondes);
	};
};



