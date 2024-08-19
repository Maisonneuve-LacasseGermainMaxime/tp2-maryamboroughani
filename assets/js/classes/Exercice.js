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

        this.conteneur.append(clone);
        this.elementHTML = this.conteneur.lastElementChild;

        this.elementHTML.id = this.id;
        this.elementHTML.innerHTML = this.elementHTML.innerHTML
            .replace(/{{date}}/g, this.date)
            .replace(/{{type}}/g, this.type);

        this.elementHTML.addEventListener("click", this.onClic.bind(this));
    }

    onClic(evenement) {
        const declencheur = evenement.target;
        const boutonSupprimer = declencheur.closest("[data-action='supprimer']");
        const exercice = declencheur.closest(".exercice");

        if (boutonSupprimer !== null) {
            // Supprime l'exercice
            const id = exercice.id;
            this.app.supprimerUnExercice(id);

        } else {
            history.pushState({}, "", `/detail/${this.id}`);
            this.app.router.miseAJourURL();
        }
    }
}

export default Exercice;
