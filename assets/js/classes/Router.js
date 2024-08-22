class Router {
    constructor(app) {
        this.app = app;
        this.routes = {
            liste: app.afficherListe.bind(app),
            ajouter: app.afficherFormulaire.bind(app),
            detail: app.afficherDetail.bind(app),
        };

        window.addEventListener("popstate", this.miseAJourURL.bind(this));
        document.addEventListener("click", this.onClicLien.bind(this));

        this.miseAJourURL();
    }

    miseAJourURL() {
        const url = window.location.pathname.slice(1); 
        const parts = url.split("/");
        let route = parts[0]; 
        let id = parts[1]; 

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
