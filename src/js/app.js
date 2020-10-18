import './../scss/progressbar.scss';
import './../scss/style.scss';

import { Dashboard } from './dashboard';
import { Examinations } from './examinations';
import { Measurements } from './measurements';

const app = {
    pages: [
        new Dashboard( '/dashboard' ),
        new Examinations( '/examinations' ),
        new Measurements( '/measurements' ),
    ]
}
