import { Pages } from 'gsd-minix/class-pages';
import PageBase from './base.hbs';

export class Login extends Pages {
    constructor( opt ) {
        super( { HTMLBody: PageBase(), ...opt } );

        $( this.elements[ 'loginByGoogle' ] ).on( 'click', e => {
            $( 'button' ).addClass( 'disabled' );
            let target = $( e.currentTarget ),
                href = target.data( 'href' );

            $( '.progress' ).show();

            if ( href ) window.location = href;
        } )
    }
}
