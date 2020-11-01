import { MinixApp } from 'gsd-minix';

import '../scss/main.scss';
import 'gsd-minix/components/progressbar.scss';

import apiRoutes from './api-routes';

import { Configuration } from './utils/configuration';
import { Fetcher } from 'gsd-minix/class-fetcher';

import { Main } from './pages/main/main';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard';
import { Examinations } from './pages/examinations';
import { Measurements } from './pages/measurements';

export let App = new MinixApp( {
    routes: {
        '/': Main,
        '/login': Login,
        '/dashboard': Dashboard,
        '/examinations': Examinations,
        '/measurements': Measurements,
    },
} );

async function Init () {

    console.log( 'Start application...' );

    const user = await new Fetcher( apiRoutes.userData, { method: 'GET' } ).getJSON();

    if ( !user || user.error ) {
        App.redirect( '/login' )
        return;
    }

    App.user = user;

    App.config = {
        examinationsListView: await new Configuration(
            apiRoutes.confExaminations,
            {
                'list-pagination': false,
                'fetch-latest': true,
                'group-view': true,
                'group-description': true,
                'examination-description': true,
            } )
    }

    App.redirect( '/dashboard' );
}

Init();