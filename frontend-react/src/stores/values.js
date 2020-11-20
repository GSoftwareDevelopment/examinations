import API from '../api-routes';
import { makeObservable, observable, action, runInAction } from 'mobx';
import Fetcher from './Fetcher';

class ValuesStore extends Fetcher {
	items = []

	constructor() {
		super('Values');
		makeObservable( this, {
			items: observable,
			reset: action,
			getItems: action,
			fetchGet: action,
			insert: action,
			remove: action,
			update: action,
		} );
	}

	reset ( defaults ) {
		this.items = [];
	}

	getItems () { return this.items; }

	async fetchGet ( examinationId ) {
		const result = await this.fetch( API.valuesList + `/${examinationId}`, 'GET' );
		runInAction( () => {
			if ( result.OK ) {
				this.items = result.values.map( value => {
					// eslint-disable-next-line
					const { createdAt, examination, name, required, type, user, __v, _id, ...rest } = value;
					return {
						id: _id,
						type,
						name,
						required,
						...rest
					}
				} );
			}
		} );
	}

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

			this.items.push( {
				action: 'create',
				id: lastValueId,
				...data
			} );
		} );
	}

	remove ( valueId ) {
		console.log( `Delete value entry #${valueId}` );
		let item = this.items.find( value => value.id === valueId );
		if ( item.action === "create" )
			this.items = this.items.filter( value => ( value.id !== valueId ) )
		else
			item.action = "delete";
	}

	update ( valueId, data ) {
		console.log( `Edit value entry #${valueId}`, data );

		runInAction( () => {
			this.items.forEach( ( value, index ) => {
				if ( value.id !== valueId ) return

				this.items[ index ] = {
					...value,
					action: ( value.action ? value.action : "update" ),
					...data
				};
			} );
		} )
	}

}

let valuesStore = window.valuesStore = new ValuesStore();
export default valuesStore;