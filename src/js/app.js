import './../scss/progressbar.scss';
import './../scss/style.scss';

import { Configuration } from './utils/configuration';

import { Dashboard } from './pages/dashboard';
import { Examinations } from './pages/examinations';
import { Measurements } from './pages/measurements';

export const App = {
    routes: {
        '/dashboard': Dashboard,
        '/examinations': Examinations,
        '/measurements': Measurements,
    },
    pages: [],
    config: [],
}
async function Init () {

    App.config.examinationsListView = await new Configuration( '/examinations/configuration', {
        'list-pagination': false,
        'fetch-latest': true,
        'group-view': true,
        'group-description': true,
        'examination-description': true,
    } );

    const currentPath = window.location.pathname

    for ( let path in App.routes ) {
        if ( path === currentPath ) {
            App.pages.push( new App.routes[ path ]( path ) );
        }
    }

    console.log( App );
}

Init();
