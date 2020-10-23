import './../scss/progressbar.scss';
import './../scss/style.scss';

import { Dashboard } from './dashboard';
import { Examinations } from './examinations';
import { Measurements } from './measurements';

const app = {
    routes: {
        '/dashboard': Dashboard,
        '/examinations': Examinations,
        '/measurements': Measurements,
    },
    pages: []
}


const currentPath = window.location.pathname

for ( let path in app.routes ) {
    if ( path === currentPath ) {
        app.pages.push( new app.routes[ path ]( path ) );
    }
}

console.log( app );