import Router from "./Router.js";
import Formulaire from "./Formulaire.js";
import Exercice from "./Exercice.js";
import ToastModale from "../components/ToastModale.js";

class App {
    static #instance;

    static get instance() {
        if (!App.#instance) {
            App.#instance = new App();
        }
        return App.#instance;
    }

    constructor() {
        if (App.#instance) {
            return App.#instance;
        }

        this.router = new Router(this);
        this.exercices = []; // Store fetched exercises

        // Initial load or default route handling
        this.router.miseAJourURL();
        
        App.#instance = this;
    }
    
    async afficherListe() {
        console.log("Fetching list of exercises...");

        try {
            const response = await fetch("http://localhost:8888/api/exercices/lireTout.php");
            this.exercices = await response.json();
            console.log(this.exercices);

            this.afficherExercicesDansDOM();

        } catch (error) {
            console.error("Error fetching exercises:", error);
            new ToastModale("Erreur lors de la récupération des exercices", "erreur");
        }
    }

    afficherExercicesDansDOM() {
        const conteneur = document.querySelector("[data-liste-exercices]");
        console.log("Element [data-liste-exercices]:", conteneur); // Check if the element is found
    
        if (!conteneur) {
            console.error("Element [data-liste-exercices] not found");
            return;
        }
    
        conteneur.innerHTML = ''; // Clear any existing content
    
        this.exercices.forEach(exerciceData => {
            new Exercice(exerciceData, conteneur, this);
        });
    }
    

    afficherFormulaire() {
        console.log("Displaying form to add new exercise...");
        const formulaire = new Formulaire(this);
        formulaire.afficherFormulaire();
    }

    afficherDetail(id) {
        console.log("Displaying details for exercise with ID:", id);

        const exercice = this.exercices.find(ex => ex.id === parseInt(id));
        if (exercice) {
            this.afficherExerciceDetailDansDOM(exercice);
        } else {
            console.error("Exercice not found.");
            new ToastModale("Exercice non trouvé", "erreur");
        }
    }

    afficherExerciceDetailDansDOM(exercice) {
        const conteneur = document.querySelector("#exercise-detail");
        if (!conteneur) {
            console.error("Element #exercise-detail not found");
            return;
        }
        conteneur.innerHTML = `
            <h2>${exercice.type}</h2>
            <p>${exercice.description}</p>
            <p>Difficulté: ${exercice.difficulte}</p>
            <p>Durée: ${exercice.duree} minutes</p>
            <p>Date: ${new Date(exercice.date).toLocaleString()}</p>
        `;
    }
}

export default App;
