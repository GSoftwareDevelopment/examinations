import API from '../api-routes';
import { makeObservable, observable, computed, action, runInAction } from 'mobx';
import Fetcher from './Fetcher';

class ExaminationsStore extends Fetcher {
	items = [];

	constructor() {
		super('Examinations');
		makeObservable( this, {
			getItems: observable,
			getItemById: action,
			fetchGet: action,
			fetchAdd: action,
			fetchDelete: action,
			fetchUpdate: action,
			insert: action,
			update: action,
			remove: action,
			removeGroup: action,
		} );
	}

	getItems () {
		return this.items;
	}

	getItemById ( itemId ) {
		return this.items.find( ( item ) => item._id === itemId );
	}

	async fetchGet () {
		const result = await this.fetch( API.examinationsGet, 'GET' );
		runInAction( () => {
			if ( result.OK ) {
				this.items = result.examinations;
			}
		} );
	}

	async fetchAdd ( newExamination ) {
		const result = await this.fetch( API.examinationsCreate, 'POST', JSON.stringify( newExamination ) );
		runInAction( () => {
			if ( result.OK ) {
				this.insert( result.created )
			}
		} );
		return result;
	}

	async fetchUpdate ( examinationId, updatedExamination ) {
		const result = await this.fetch( API.examinationsUpdate + examinationId, 'POST', JSON.stringify( updatedExamination ) );
		runInAction( () => {
			if ( result.OK ) {
				const body = {
					name: updatedExamination.name,
					group: updatedExamination.group,
					description: updatedExamination.description,
				}
				this.update( examinationId, body );
			}
		} );

		return result;
	}

	async fetchDelete ( items ) {
		const result = await this.fetch( API.examinationsDelete, 'DELETE', JSON.stringify( items ) );

		runInAction( () => {
			if ( !result.error ) {
				console.log( 'Examination(s) was successfull deleted' );
				items.forEach( itemId => {
					this.remove( itemId );
				} );
			}
		} );

		return result;
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