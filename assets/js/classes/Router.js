class Router {
    constructor(app) {
        this.app = app;
        this.routes = {
            liste: app.afficherListeExercices.bind(this.app),
            ajouter: app.afficherFormulaireAjouter.bind(this.app),
            detail: app.afficherDetailExercice.bind(this.app),
        };

        window.addEventListener("popstate", this.miseAJourURL.bind(this));
        document.addEventListener("click", this.onClicLien.bind(this));

        this.miseAJourURL();
    }

    miseAJourURL() {
        const url = window.location.pathname.slice(1); // Remove the leading '/'
        const parts = url.split("/"); // Split the URL into parts
        let route = parts[0]; // The first part of the URL is the route
        let id = parts[1]; // The second part (if exists) is the id

        const fonctionRoute = this.routes[route];
        if (id) {
            fonctionRoute(id);
        } else if (fonctionRoute) {
            fonctionRoute();
        } else {
            this.routes["liste"](); // Default route
        }
    }

    onClicLien(evenement) {
        const elementClique = evenement.target.closest("[data-lien]");
        if (elementClique !== null) {
            evenement.preventDefault();
            const url = elementClique.href;
            history.pushState({}, "", url);

            this.miseAJourURL();
        }
    }
}

export default Router;

