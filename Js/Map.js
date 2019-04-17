/* On retrouve dans cette feuille une class "SuperMap" pour generer la map, les marqueurs et le package de ces derniers
Il est a noter que l'URL du script de chargement de la map dans le code HTML est simplifie (il n'y a plus de callback)
Les attributs "async" et "defer" ont egalement disparu
En contrepartie, notre objet instancie "dieu" initiera la map a l'aide d'une methode lui appartenant */

/* ---------------------------------------------------------------------------- */

/* LA CLASSE "SuperMap" */
class SuperMap {
	constructor() {
		this.lat = 45.765000;
	  	this.lng = 4.850000;
	  	this.icon = "Images/Marqueur.png";
	  	this.carte = null;
	  	this.tableauMarqueurs = []; // Tableau qui ne contient que les marqueurs pour le stack de ces derniers via la méthode "stackMarqueurs"
	};
	
	init() { // Methode pour faire apparaitre la carte sur la page
		this.carte = new google.maps.Map(document.getElementById("blocmap"), {
			center: {lat: this.lat, lng: this.lng}, // Insertion des coordonnees des options
			zoom: 12, // Pour avoir un bon visuel du centre de Lyon {}
		});
	};
	
	couleurIcon(etatStation) { // Methode pour attribuer un marqueur vert ou rouge selon le statut de la station
		if (etatStation.statutStation === "OPEN" && etatStation.velosDispos > 0) {
			this.icon = "Images/Marqueur.png";
		} else {
			this.icon = "Images/Marqueur2.png";
		};
	};

	ajoutMarqueurs(infos) {
		this.couleurIcon(infos); // Appel de la methode "couleurIcon" en lui passant en paramètres les informations relatives au statut de la station
		var marqueur = new google.maps.Marker({
			map: this.carte,
			icon: {
				url: this.icon,
				scaledSize: new google.maps.Size(65, 65)
			},
			position: infos.positionStation // Le parametre "infos" possede toutes les donnees des stations. Seules les coordonnees nous seront utiles ici
 		});
		this.tableauMarqueurs.push(marqueur); // Indispensable pour la methode "stackMarqeurs"

		google.maps.event.addListener(marqueur, "click", function() { // L'idee est ici de creer un event custom pour faciliter la communication intra classes
			var nouveauClicMarqueur = new CustomEvent("clicMarqueur", {detail: infos}); // L'objet en 2eme parametre possede les donnees de la station selectionnee
			document.dispatchEvent(nouveauClicMarqueur); // Distribution de l'event (pas besoin d'une cible particuliere vu l'utilite fonctionnelle de ce dernier)
		});
	};

	stackMarqueurs() { // Methode pour stacker les marqueurs
		var MarqueursCluster = new MarkerClusterer(this.carte, this.tableauMarqueurs, {
			maxZoom: 14,
			imagePath : "Images/m"
		}); 
	};
};


