// assets/js/classes/router.js
class Router {
    constructor(app) {
        this.app = app;
        this.routes = {
            liste: app.afficherListe.bind(app),
            ajouter: app.afficherFormulaire.bind(app),
            detail: app.afficherDetail.bind(app),
        };

        // Listen to browser's back/forward navigation
        window.addEventListener("popstate", this.miseAJourURL.bind(this));
        // Intercept all clicks to handle in-app navigation
        document.addEventListener("click", this.onClicLien.bind(this));

        // Initialize the router to handle the current URL
        this.miseAJourURL();
    }

    miseAJourURL() {
        const url = window.location.pathname.slice(1); // Remove leading '/'
        const parts = url.split("/");
        const route = parts[0] || "liste"; // Default to "liste" if route is empty
        const id = parts[1]; // ID, if any

        const fonctionRoute = this.routes[route];
        if (fonctionRoute) {
            fonctionRoute(id); // Call the route function, passing the ID if present
        } else {
            // If the route is not recognized, fallback to default route
            this.routes["liste"]();
        }
    }

    onClicLien(evenement) {
        const elementClique = evenement.target.closest("[data-lien]");
        if (elementClique !== null) {
            evenement.preventDefault();
            const url = elementClique.href;
            history.pushState({}, "", url); // Update the URL without reloading the page

            this.miseAJourURL(); // Update the router state
        }
    }
}

export default Router;
