// import API from '../api-routes';
import { makeAutoObservable, runInAction } from 'mobx';

class ConfigurationStore {
    configState = {
        'AddValue': {
            descriptionsHide: true,
        }
    }
    constructor() {
        makeAutoObservable( this );
    }

    getConf ( componentName, prop ) {
        return this.configState[ componentName ][ prop ];
    }
    setConf ( componentName, prop, value ) {
        runInAction( () => {
            this.configState[ componentName ][ prop ] = value;
        } )
    }
}

let configStore = window.configStore = new ConfigurationStore();
export default configStore;