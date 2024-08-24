// assets/js/classes/formulaire.js
class Formulaire {
    constructor(app) {
        this.app = app;
        this.formulaireHTML = document.querySelector("form");

        // Validate the form initially and on change
        this.formulaireHTML.addEventListener("input", this.validateForm.bind(this));

        // Add submit event listener
        this.formulaireHTML.addEventListener("submit", this.onSoumettre.bind(this));
    }

    validateForm() {
        // Disables the submit button if the form is invalid
        const submitButton = this.formulaireHTML.querySelector("#submit");
        submitButton.disabled = !this.formulaireHTML.checkValidity();
    }

    async onSoumettre(evenement) {
        evenement.preventDefault();

        if (this.formulaireHTML.checkValidity()) {
            const body = {
                type: this.formulaireHTML.type.value,
                date: this.formulaireHTML.date.value,
                duree: this.formulaireHTML.duree.value,
                description: this.formulaireHTML.description.value,
                // Make sure to handle difficulte properly
                difficulte: this.formulaireHTML.difficulte ? this.formulaireHTML.difficulte.value : 1, // Default to 1 if not present
            };

            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            };

            try {
                const response = await fetch("http://localhost:8888/api/exercices/ajouterUn.php", config);
                const message = await response.json();
                console.log(message);

                if (message.success) {
                    new ToastModale("Exercice ajouté avec succès", "succes");
                    this.app.afficherListe(); // Refresh the list after adding
                    this.formulaireHTML.reset(); // Optionally reset the form
                    this.validateForm(); // Revalidate the form after reset
                } else {
                    new ToastModale("Erreur lors de l'ajout de l'exercice", "erreur");
                }
            } catch (error) {
                console.error("Error adding exercise:", error);
                new ToastModale("Erreur lors de l'ajout de l'exercice", "erreur");
            }
        }
    }
}

export default Formulaire;
