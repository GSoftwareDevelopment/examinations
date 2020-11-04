import { Pages } from 'gsd-minix/class-pages';
import PageBase from './register.hbs';

export class Register extends Pages {
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
