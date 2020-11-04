import { Modal } from "gsd-minix/components";

import ModalTemplate from './_modal.hbs';

class FilterMeasurements extends Modal {
    constructor( _page ) {
        super( $( ModalTemplate() ), {}, _page );
    }
}

export { FilterMeasurements }