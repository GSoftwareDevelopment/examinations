import { makeAutoObservable, runInAction } from 'mobx';

class ValuesStore {
	items = []

	constructor() {
		makeAutoObservable( this );
	}

	reset ( defaults ) {
		this.items = defaults
	}

	getItems () { return this.items; }

	insert ( data ) {
		console.log( 'Adding new value...', data )

		runInAction( () => {
			// Determine the highest value for the value index
			let lastValueId = 0;
			this.items.forEach( ( item ) => {
				if ( item.id > lastValueId )
					lastValueId = item.id
			} );
			lastValueId++ // incrase to next "free" value

			this.items.push( { id: lastValueId, ...data } );
		} );
	}

	remove ( valueId ) {
		console.log( `Delete value entry #${valueId}` );
		this.items = this.items.filter( value => ( value.id !== valueId ) )
	}

	update ( valueId, data ) {
		console.log( `Edit value entry #${valueId}`, data );

		runInAction( () => {
			this.items.forEach( ( value, index ) => {
				if ( value.id === valueId ) {
					this.items[ index ] = { ...value, ...data };
				}
			} );
		} )
	}

}

let valuesStore = window.valuesStore = new ValuesStore();
export default valuesStore;