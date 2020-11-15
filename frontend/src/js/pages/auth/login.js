import { App } from '../../app';
import apiRoutes from '../../api-routes';

import { Pages } from 'gsd-minix/class-pages';
import PageBase from './login.hbs';

export class Login extends Pages {
    constructor( opt ) {
        super( {
            parentPage: opt.App.redirect( '/log' ),
            HTMLBody: PageBase(),
            ...opt
        } );

        $( this.elements[ 'btn-login' ] ).on( 'click', ( e ) => { this.login( 'local' ); } );
        $( this.elements[ 'btn-google' ] ).on( 'click', ( e ) => { this.login( 'google' ); } );
    }

    onSubmit ( e ) {
        e.preventDefault();
        this.login( 'local' );
    }

    login ( vendor ) {
        switch ( vendor ) {
            case 'local':
                const email = this.elements[ 'form-email' ].value,
                    password = this.elements[ 'form-pass' ].value;

                fetch( apiRoutes.authenticate, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( { email, password } )
                } )
                    .then( ( response ) => {
                        return response.json();
                    } )
                    .then( ( data ) => {
                        console.log( data );
                        if ( data.token ) {
                            localStorage.setItem( 'token', data.token );
                            window.location = "/"
                        } else {
                            this.showMessage( data.message );
                        }
                    } )
                    .catch( ( error ) => {
                        console.log( '!! ERROR !!: ', error );
                    } )
                break;
            case 'google':
                fetch( 'http://localhost:3000/auth/google/', {
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
                break;
            default:
                console.error( 'login vendor is not pointed' )
                return;
        }
    }

    showMessage ( msg ) {

        let alert = $( `
            <div id="log-alert" class="alert alert-warning alert-dismissible fade show" role="alert">
                <p id="log-alert-msg" class="mb-0">${msg}</p>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`);

        $( this.forms[ 'login-form' ] ).before( alert );
    }
}
