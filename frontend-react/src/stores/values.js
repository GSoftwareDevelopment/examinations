import API from '../api-routes';
import { makeAutoObservable, runInAction } from 'mobx';
import UserStore from '../stores/user';

class ValuesStore {
	state = "done" // "pending" / "error" / "done"
	items = []
	error = null;

	constructor() {
		makeAutoObservable( this );
	}

	getState () { return this.state }
	getError () { return this.error }
	clearError () {
		runInAction( () => {
			this.state = 'done';
			this.error = null;
		} )
	}

	reset ( defaults ) {
		this.items = defaults
	}

	getItems () { return this.items; }

	async fetchGet ( examinationId ) {
		this.state = "pending";
		// this.items = [];

		if ( UserStore.state !== 'logged' ) {
			console.log( `Can't do operation 'fetchGet' when user is not logged` );
			return;
		}
		const token = UserStore.getToken();

		try {

			const res = await fetch( API.valuesList + `/${examinationId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					}
				} );

			let result = await res.json();

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
					this.state = "done";
				} else {
					console.error( 'Backend error', result );
					this.state = "error";
					this.error = {
						title: 'Backend error',
						msg: result.error.message,
						error: result.error
					}
				}
			} );

		} catch ( error ) {
			runInAction( () => {
				console.error( 'Fetch error:', error );
				this.state = "error";
				this.error = {
					title: 'Fetch error',
					msg: error.message,
					error
				}
			} )
		}
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

			this.items.push( { id: lastValueId, ...data } );
		} );
	}

	remove ( valueId ) {
		console.log( `Delete value entry #${valueId}` );
		this.items = this.items.filter( value => ( value.id !== valueId ) )
	}

	removeOnUpdate ( valueId ) {
		console.log( `Setting flag deleteOnUpdate on entry #${valueId}` );
		let item = this.items.find( value => value.id === valueId );
		item.deleteOnUpdate = true;
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