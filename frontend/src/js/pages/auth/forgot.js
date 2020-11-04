import { Pages } from 'gsd-minix/class-pages';
import PageBase from './forgot.hbs';

export class Forgot extends Pages {
    constructor( opt ) {
        super( {
            parentPage: opt.App.redirect( '/log' ),
            HTMLBody: PageBase(),
            ...opt
        } );
    }

    onSubmit () {
    }
}
