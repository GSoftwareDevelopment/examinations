import { App } from '../../app';

import { Pages } from 'gsd-minix/class-pages';

import PageBase from './base.hbs';

export class Main extends Pages {
    constructor( opt ) {

        super( {
            HTMLBody: PageBase( { user: App.user } ),
            pageContent: 'main[role="main"]',
            ...opt
        } );

        $( this.elements[ 'sidebarNav' ] ).find( 'a.nav-link' )
            .on( 'click', ( e ) => {
                e.preventDefault();
                $( this.elements[ 'sidebarNav' ] ).removeClass( 'show' );

                const path = e.currentTarget.pathname;
                App.redirect( path );
            } );
    }
}