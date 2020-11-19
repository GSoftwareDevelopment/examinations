import API from '../api-routes';
import { makeAutoObservable, runInAction } from 'mobx';
import UserStore from '../stores/user';

class ExaminationsStore {
	state = "pending"; // "pending" / "done" / "error"
	items = [];
	error = null;

	constructor() {
		makeAutoObservable( this );
	}

	getItems () {
		return this.items;
	}

	getItemById ( itemId ) {
		return this.items.find( ( item ) => item._id === itemId );
	}

	getState () { return this.state }
	getError () { return this.error }
	clearError () {
		runInAction( () => {
			this.state = 'done';
			this.error = null;
		} )
	}

	async fetchGet () {
		this.state = "pending";
		// this.items = [];

		if ( UserStore.state !== 'logged' ) {
			console.log( `Can't do operation 'fetchGet' when user is not logged` );
			return;
		}
		const token = UserStore.getToken();

		try {

			const res = await fetch( API.examinationsGet,
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
					this.items = result.examinations;
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

	async fetchAdd ( newExamination ) {
		if ( UserStore.state !== 'logged' ) {
			console.log( `Can't do operation 'fetchAdd' when user is not logged` );
			return;
		}
		const token = UserStore.getToken();
		this.state = "pending";

		try {
			const res = await fetch( API.examinationsCreate, // 'http://localhost:3000/api/examinations',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					},
					body: JSON.stringify( newExamination )
				} );
			if ( !res.ok ) {
				let result = await res.text();
				throw new Error( result );
			}
			let result = await res.json();
			runInAction( () => {
				if ( result.OK ) {
					this.state = "done";
					this.insert( result.created )
				}

				if ( result.error ) {
					this.state = "error";
					console.error( 'Backend error:', result.error );
					this.error = {
						title: 'Backend error',
						msg: result.error.message,
						error: result.error
					}
				}
			} )

			return result;
		} catch ( error ) {
			runInAction( () => {
				this.state = "error";
				console.error( 'Fetch error:', error );
				this.error = {
					title: 'Fetch error',
					msg: error.message,
					error
				}
			} )
			return false;
		}
	}

	async fetchUpdate ( examinationId, updatedExamination ) {
		if ( UserStore.state !== 'logged' ) {
			console.log( `Can't do operation 'fetchAdd' when user is not logged` );
			return;
		}
		const token = UserStore.getToken();
		this.state = "pending";

		try {
			const res = await fetch( API.examinationsUpdate + examinationId, // 'http://localhost:3000/api/examinations/:id',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					},
					body: JSON.stringify( updatedExamination )
				} );

			let result = await res.json();
			console.log( result );
			runInAction( () => {
				if ( result.OK ) {
					const body = {
						name: updatedExamination.name,
						group: updatedExamination.group,
						description: updatedExamination.description,
					}
					this.update( examinationId, body );
					this.state = "done";
				}

				if ( result.error ) {
					console.error( 'Backend error:', result.error );
					this.error = {
						title: 'Backend error',
						msg: result.error.message,
						error: result.error
					}
					this.state = "error";
				}
			} )

			return result;
		} catch ( error ) {
			runInAction( () => {
				this.state = "error";
				console.error( 'Fetch error:', error );
				this.error = {
					title: 'Fetch error',
					msg: error.message,
					error
				}
			} )
			return false;
		}
	}

	async fetchDelete ( items ) {
		if ( UserStore.state !== 'logged' ) {
			console.log( `Can't do operation 'fetchDelete' when user is not logged` );
			return;
		}

		const token = UserStore.getToken();
		this.state = "pending";

		try {
			const res = await fetch( API.examinationsDelete, // 'http://localhost:3000/api/examinations',
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + token
					},
					body: JSON.stringify( items )
				} );

			let result = await res.json();

			runInAction( () => {
				if ( !result.error ) {
					console.log( 'Examination(s) was successfull deleted' );
					this.state = "done";
					items.forEach( itemId => {
						this.remove( itemId );
					} );
				}

				if ( result.error ) {
					this.state = "error";
					console.log( 'Backend error:', result.error );
					this.error = {
						title: 'Backend error',
						msg: result.error.message,
						error: result.error
					}

				}
			} )

			return result;
		} catch ( error ) {
			runInAction( () => {
				this.state = "error";
				console.error( 'Fetch error: ', error );
				this.error = {
					title: 'Fetch error',
					msg: error.message,
					error
				}

			} )
			return false;
		}
	}

	insert ( examinationData ) {
		this.items.push( examinationData );
	}

	update ( examinationId, examinationData ) {
		console.log( `Update examination entry #${examinationId}`, examinationData );

		runInAction( () => {
			this.items.forEach( ( examination, index ) => {
				if ( examination._id !== examinationId ) return

				this.items[ index ] = {
					...examination,
					...examinationData
				};
			} );
		} )
	}

	remove ( itemId ) {
		this.items = this.items.filter( item => ( item._id !== itemId ) );
	}

	removeGroup ( groupId ) {
		this.items = this.items.filter( item => ( item.group !== groupId ) );
	}
}

let examinationsStore = window.examinationsStore = new ExaminationsStore();
export default examinationsStore;