import { Pages } from 'gsd-minix/class-pages';

export class Logout extends Pages {
    constructor( opt ) {
        super( { ...opt } );
        localStorage.removeItem( 'token' );
        opt.App.redirect( '/log/in' );
    }
}