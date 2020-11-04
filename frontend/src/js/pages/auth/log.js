import { Pages } from 'gsd-minix/class-pages';
import PageBase from './base.hbs';

export class Log extends Pages {
    constructor( opt ) {
        super( {
            HTMLBody: PageBase(),
            pageContent: 'main[role="main"]',
            ...opt
        } );
    }
}
