export class Pages {
    constructor( path ) {
        this.page = $( `main[role='main']` );
        this.path = path;

        this.modal = {};

        let _progress = $( this.page ).find( '[role="progressbar"], [role="status"]' ).get();
        this.progress = new Array();

        for ( let el of _progress ) {
            this.progress[ el.id ] = el;
            $( el ).hide();
        }

        const isPath = path === window.location.pathname
        return isPath;
    }
}