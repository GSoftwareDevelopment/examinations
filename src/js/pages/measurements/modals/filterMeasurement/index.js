import { Modal } from "gsd-minix/components/modal";

import ModalTemplate from './templates/_modal.hbs';

class FilterMeasurements extends Modal {
    constructor( _page ) {
        super( ModalTemplate(), _page );
    }
}

export { FilterMeasurements }