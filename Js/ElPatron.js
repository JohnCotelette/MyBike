/* Le fichier de l'arme absolue 
Celui qui decide de tout... 
Un fichier Javascript dont il faut serieusement se mefier ! */

/* ---------------------------------------------------------------------------- */

/* UNE CLASSE POUR POUVOIR INSTANCIER L'ARME FATALE */
class ElPatron {
	constructor() { // Le but ici est d'instancier et/ou stocker tous nos objets utiles au fonctionnement de l'application "Mybike" (Les ouvriers d'"ElPatron" en quelque sorte)
		this.newSlider = new Slider;
		this.newMap = new SuperMap;
		this.newSignature = new Signature;
		this.newGestionnaireDonneesStations = new GestionnaireDonneesStations;
		this.newGestionnaireDonneesReservation = new GestionnaireDonneesReservation;
		this.newGestionnaireAffichage = new GestionnaireAffichage;
	};

	initGod() { // Le cerveau du diable... Ce qui va suivre est assez diabolique
		this.newSlider.initControles(); // Initialisez les controles du slider pauvres manants !
		this.newMap.init(); // Initialisez l'affichage de la map pauvre bougres !
		this.newSignature.initControles(); // Le canvas est deja operationnel

		this.initRecupDonnees() // Recuperez moi une promesse contenant les donnees en provenance de l'API "JC Decaux"
		.then((donneesCompletesStations) => { // Une fois cela fait...
			this.initStockageDonnees(donneesCompletesStations); // Stockez les donnees !
			return this.newGestionnaireDonneesStations.donneesStations; // Renvoyez moi le tableau de stockage des donnees, C'EST UN ORDRE !!!
		})
		.then((donneesStations) => { 
			this.initMapMarqueurs(donneesStations); // Une fois cette tache accomplie, ajoutez moi les marqueurs !
			this.newMap.stackMarqueurs(donneesStations); // Et Stackez les !
		})
		.then(() => {
			this.newGestionnaireDonneesReservation.initReservationApp(); // "newGestionnaireDonneesReservation", mon esclave prefere ! Initie ton application !
			this.newGestionnaireAffichage.initAffichage();
		}); // Le reste du fonctionnement de l'application depend maintenant du fonctionnement interne des objets instancies et du "localStorage" ("ElPatron" a cree l'application)
	};

	initRecupDonnees() { // Methode qui recupere les donnees de l'API "JC Decaux" via l'obtention d'une promesse
		return new Promise((resolve, reject) => {
			this.newGestionnaireDonneesStations.recupDonnees("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8d05140946332a35c2154d03dd2d82f83890c4a2")
			.then(function(donneesCompletesStations) {
				resolve(donneesCompletesStations);
			});
		});
	};
		
	initStockageDonnees(donnees) { // Methode pour ordonner de stocker les donnees dans un tableau 
		for (var i = 0; i < donnees.length; i++) {
			this.newGestionnaireDonneesStations.stockageDonnees(donnees[i]);
		};
	};

	initMapMarqueurs(donnees) { // Methode pour ordonner d'ajouter les marqueurs sur la map
		for (var i = 0; i < donnees.length; i++) {
			this.newMap.ajoutMarqueurs(donnees[i]);
		};
	};
};

/* ---------------------------------------------------------------------------- */

/* CREATION DE L'ETRE ULTIME */
var dieu = new ElPatron; // Manque d'originalite
dieu.initGod();