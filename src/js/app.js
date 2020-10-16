import moment from 'moment';

class Application {
    constructor() {
        Handlebars.registerHelper( 'formatDate', function ( date, format ) {
            return moment( date ).format( format );
        } );

        this.page = {};
        this.modal = {};
    }
}

const app = new Application();