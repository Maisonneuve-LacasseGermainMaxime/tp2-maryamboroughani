// assets/js/classes/exercice.js
class Exercice {
    constructor(exerciceInfos, conteneur, app) {
        const { id, type, date, duree, description, difficulte } = exerciceInfos;
        this.conteneur = conteneur;
        this.app = app;

        this.id = id;
        this.type = type;
        this.date = date;
        this.duree = duree;
        this.description = description;
        this.difficulte = difficulte;

        this.gabaritExercice = document.querySelector("template#exercice");
        this.injecterHTML();
    }

    injecterHTML() {
        let clone = this.gabaritExercice.content.cloneNode(true);

        // Replace template placeholders with actual data
        clone.querySelector('[data-exercice-date]').textContent = this.date;
        clone.querySelector('[data-exercice-type]').textContent = this.type;

        // Append the cloned template to the container
        this.conteneur.append(clone);

        // Select the newly added element
        this.elementHTML = this.conteneur.lastElementChild;

        // Attach event listener to the entire exercise element
        this.elementHTML.addEventListener("click", this.onClic.bind(this));
    }

    async onClic(evenement) {
        const declencheur = evenement.target;
        const boutonSupprimer = declencheur.closest(".btn.danger");
        const exercice = declencheur.closest(".exercice");

        if (boutonSupprimer !== null && exercice !== null) {
            // Supprime l'exercice
            const id = exercice.id;
            try {
                const response = await fetch(`http://localhost:8888/api/exercices/supprimerUn.php?id=${id}`, {
                    method: 'GET', // Match the PHP script's expected method
                });
                const message = await response.json();
                //console.log(message);
                if (response.ok) { // Check if the response status is OK
                    new ToastModale("Exercice supprimé avec succès", "succes");
                    this.app.afficherListe(); // Refresh the list
                } else {
                    new ToastModale("Erreur lors de la suppression de l'exercice", "erreur");
                }
            } catch (error) {
                console.error("Error deleting exercise:", error);
                new ToastModale("Erreur lors de la suppression de l'exercice", "erreur");
            }
        } else if (exercice !== null) {
            // Navigate to detail view
            history.pushState({}, "", `/detail/${this.id}`);
            this.app.router.miseAJourURL();
        }
    }
}

export default Exercice;
