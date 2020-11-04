import { Pages } from 'gsd-minix/class-pages';

import PageBody from './body.hbs';

export class Dashboard extends Pages {
    constructor( opt ) {
        super( {
            parentPage: opt.App.redirect( '/' ),
            HTMLBody: PageBody(),
            ...opt,
        } );

    }
}