export class Pages {
    constructor( path ) {
        this.modal = {};
        this.path = path;

        const isPath = path === window.location.pathname
        return isPath;
    }
}