import { Pages } from 'gsd-minix/class-pages';
import PageBase from './login.hbs';

export class Login extends Pages {
    constructor( opt ) {
        super( {
            parentPage: opt.App.redirect( '/log' ),
            HTMLBody: PageBase(),
            ...opt
        } );

        $( this.elements[ 'btn-google' ] ).on( 'click', ( e ) => { this.login( 'google' ); } )
    }

    login ( vendor ) {
        let api = '';
        switch ( vendor ) {
            case 'google':
                api = 'http://localhost:3000/auth/google/';
                break;
            default:
                console.error( 'login vendor is not pointed' )
                return;
        }

        fetch( api, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        } )
            .then( ( response ) => {
                console.log( response );
                return response.text();
            } )
            .then( ( data ) => {
                console.log( data );
            } )
            .catch( ( err ) => {
                console.log( err );
            } )

    }

    onSubmit () {
    }
}
