import 'bootstrap';
import { Fetcher } from './class/Fetcher';
import { TemplateFetch } from './class/TemplateFetch';
import { AddMeasurement } from './modals/measurements/addMeasurement';
import { FilterMeasurements } from './modals/measurements/filterMeasurements';

class Measurements {
    constructor() {
        this.modal_AddMeasurement = new AddMeasurement();
        this.modal_FilterMeasurements = new FilterMeasurements();

        this.measurements = new Fetcher( "/measurements/?data", { method: "GET" } );

        this.tplList = new TemplateFetch( {
            template: "_measurements._list",
            appendTo: $( 'div#measurements-results' )
        } );

        this.getData();
    }

    getData () {
        this.measurements.getJSON()
            .then( ( data ) => {
                this.tplList.make( { lists: data } );
            } );
    }
}
const measurements = new Measurements();