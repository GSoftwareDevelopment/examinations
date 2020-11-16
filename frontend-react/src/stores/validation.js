import { makeAutoObservable, runInAction, autorun } from 'mobx';

class ValidationStore {
	fields = [];

	constructor() {
		makeAutoObservable( this );
	}

	setField ( componentName, fieldName, value ) {
		let found = false;
		for ( let field of this.fields ) {
			if ( field.component === componentName && field.name === fieldName ) {
				field.value = value;
				found = true; break;
			}
		}
		if ( found ) return;
		this.fields.push( {
			component: componentName,
			name: fieldName,
			value,
		} );
	}

	getField ( componentName, fieldName ) {
		let componentFields = this.fields.filter( field => field.component === componentName );
		if ( fieldName ) {
			let fields = componentFields.filter( item => item.name === fieldName );
			return fields;
		} else
			return componentFields;
	}

	removeField ( componentName, fieldName ) {
		let newFields;
		if ( fieldName )
			newFields = this.fields.filter( field => !( field.component === componentName && field.name === fieldName ) )
		else
			newFields = this.fields.filter( field => !( field.component === componentName ) )

		this.fields = newFields;
	}

	check ( componentName, fieldName ) {
		let valid = true;
		this.getField( componentName, fieldName ).forEach( item => {
			if ( item.value !== true ) {
				valid = false;
				return false
			}
		} );
		return valid;
	}
}

let validationStore = window.validationStore = new ValidationStore();

// autorun( () => {
// 	console.log( '--- Validation store:' )
// 	validationStore.fields.forEach( field => {
// 		console.log( `${field.component}.${field.name}=${field.value}` )
// 	} )
// } );

export default validationStore;