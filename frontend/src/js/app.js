import { MinixApp } from 'gsd-minix';

import '../scss/main.scss';
import 'gsd-minix/components/progressbar.scss';

import apiRoutes from './api-routes';

import { Authorization } from './utils/authorization';
import { Configuration } from './utils/configuration';
import { Fetcher } from 'gsd-minix/class-fetcher';

import { Log } from './pages/auth/log';
import { Login } from './pages/auth/login';
import { Logout } from './pages/auth/logout';
import { Register } from './pages/auth/register';
import { Forgot } from './pages/auth/forgot';
import { Main } from './pages/main/main';
import { Dashboard } from './pages/dashboard';
import { Examinations } from './pages/examinations';
import { Measurements } from './pages/measurements';

export let App = new MinixApp( {
    routes: {
        '/': Main,
        '/log': Log,
        '/log/in': Login,
        '/log/out': Logout,
        '/log/register': Register,
        '/log/forgot': Forgot,
        '/dashboard': Dashboard,
        '/examinations': Examinations,
        '/measurements': Measurements,
    },
} );

console.log( App );

async function Init () {

    console.log( 'Start application...' );

    const user = await new Fetcher( apiRoutes.userData, {
        method: 'GET', ...Authorization
    } ).getJSON();

    if ( !user || user.error ) {
        App.redirect( '/log/in' )
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