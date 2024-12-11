// assets/js/classes/App.js
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
        //console.log("Fetching list of exercises...");
    
        try {
            const response = await fetch("http://localhost:8888/api/exercices/lireTout.php");
            this.exercices = await response.json();
            //console.log("Fetched exercices:", this.exercices); // Check fetched data
            this.afficherExercices();
        } catch (error) {
            console.error("Error fetching exercises:", error);
            new ToastModale("Erreur lors de la récupération des exercices", "erreur");
        }
    }
    
    afficherExercices() {
        const conteneur = document.querySelector("[data-liste-exercices]");
        //console.log("Element [data-liste-exercices]:", conteneur); // Check if the element is found

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
        //console.log("Displaying form to add new exercise...");
        const formulaire = new Formulaire(this);
        formulaire.afficherFormulaire();
    }
    
    afficherDetail(id) {
        //console.log("Displaying details for exercise with ID:", id);

        const exercice = this.findExerciceById(id);

        if (exercice) {
            this.afficherExerciceDetail(exercice);
        } else {
            console.error("Exercice not found.");
            new ToastModale("Exercice non trouvé", "erreur");
        }
    }

    afficherExerciceDetail(exercice) {
        const conteneur = document.querySelector("[data-exercice-infos]");
        if (!conteneur) {
            console.error("Element [data-exercice-infos] not found");
            return;
        }

        conteneur.innerHTML = `
            <h3>${exercice.type}</h3>
            <p>Durée: <span data-duree>${exercice.duree}</span> minutes</p>
            <p>Date: <span data-date>${new Date(exercice.date).toLocaleString()}</span></p>
            <p>Description: <span data-description>${exercice.description}</span></p>
            <p>Difficulté: <span data-difficulte>${exercice.difficulte}</span></p>
            <button class="btn danger" id="btn-supprimer">Supprimer l'exercice</button>
        `;

        // Add event listener for delete button
        const deleteButton = document.querySelector("#btn-supprimer");
        if (deleteButton) {
            deleteButton.addEventListener("click", () => this.supprimerExercice(exercice.id));
        }
    }

    async supprimerExercice(id) {
        //console.log("Attempting to delete exercise with ID:", id);
        try {
            const response = await fetch(`http://localhost:8888/api/exercices/supprimerUn.php?id=${id}`, {
                method: 'GET' // Ensure the PHP script expects this method
            });
            const message = await response.json();
            //console.log(message);
            if (response.ok) { // Check if the response status is OK
                new ToastModale("Exercice supprimé avec succès", "succes");
                this.afficherListe(); // Refresh the list
            } else {
                new ToastModale("Erreur lors de la suppression de l'exercice", "erreur");
            }
        } catch (error) {
            console.error("Error deleting exercise:", error);
            new ToastModale("Erreur lors de la suppression de l'exercice", "erreur");
        }
    }

    findExerciceById(id) {
        const idStr = String(id);
       // console.log("Current exercices:", this.exercices);

        this.exercices.forEach(exercice => {
           // console.log(`Exercice ID: ${exercice.id}, Type: ${typeof exercice.id}`);
        });

        return this.exercices.find(ex => String(ex.id) === idStr);
    }
}

export default App;
