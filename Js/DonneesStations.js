/* Il etait necessaire de creer une classe dediee a la recuperation des donnees via l'API "JC Decaux" */

/* ---------------------------------------------------------------------------- */

/* UNE CLASSE "GestionnaireDonneesStations" POUR RECUPERER ET STOCKER LES DONNEES DE L'API */
class GestionnaireDonneesStations {
	constructor() {
		this.nomStation = document.getElementById("nomstation"); // Indispensable pour etablir un comparatif lors du lastCheck

		this.autorisationReservation = null;
		this.donneesStations = [];

		this.ecouteurUltimeCheck = document.addEventListener("ultimeCheckAPI", (e) => { // Un ecouteur integre pour etablir un ultime check du nombre de velos disponibles
			this.lastCheck()
			.then((reponse) => {
				var ultimeCheckReponse = new CustomEvent("ultimeCheckReponse", {detail: reponse}); // Un autre custom event qui retourne le resultat du dernier check
				document.dispatchEvent(ultimeCheckReponse);
			});
		});
	};

	recupDonnees(url) { // Une promesse generique utilisant le "XMLHTTPRequest" pour recuperer les donnees des stations
    	return new Promise(function(resolve, reject) {
       		var req = new XMLHttpRequest();
       		req.open("GET", url);
        	req.addEventListener("load", function() {
            	if (this.status >= 200 && this.status < 300) {
               		resolve(JSON.parse(req.responseText));
            	};
        	});
        	req.send(null);
    	});
	};

	stockageDonnees(donnees) { // Permet d'instancier un nouvel item pour chaque station et de tous les stocker dans un tableau
		this.donneesStations.push(new Station(donnees.name, donnees.address, donnees.available_bikes, donnees.available_bike_stands ,donnees.status, donnees.position));
	};

	lastCheck() { // Methode appelee lors d'une validation de reservation pour verifier qu'il y a bien toujours un velo disponible (du temps peut s'ecouler entre la recuperation des donnees et la reservation effective)
		return new Promise((resolve, reject) => {
			this.recupDonnees("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=8d05140946332a35c2154d03dd2d82f83890c4a2")
			.then((donneesCompletesStations) => {
				for (var i = 0; i < donneesCompletesStations.length; i++) {
					if (this.nomStation.textContent === donneesCompletesStations[i].name) {
						if (donneesCompletesStations[i].available_bikes > 0) {
							resolve("oui");
						} else {
							resolve("non");
						};
					};
				};
			});
		});
	};
};

/* ---------------------------------------------------------------------------- */

/* UNE CLASSE "Station" JUSTE POUR STOCKER LES DONNEES DES STATIONS PROPREMENT DANS LA CLASSE "GestionnaireDonnees" */
class Station {
	constructor(nomStation, adresseStation, velosDispos, placesDispos, statutStation, positionStation) {
		this.nomStation = nomStation;
		this.adresseStation = adresseStation;
		this.velosDispos = velosDispos;
		this.placesDispo = placesDispos;
		this.statutStation = statutStation;
		this.positionStation = positionStation;
	};
};