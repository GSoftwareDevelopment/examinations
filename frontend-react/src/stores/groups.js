import API from '../api-routes';
import { makeObservable, observable, action, runInAction } from 'mobx';
import Fetcher from './Fetcher';
import ExaminationsStore from '../stores/examinations';

class GroupsStore extends Fetcher {
	items = [];

	constructor() {
		super(`Groups`);
		makeObservable( this, {
			items: observable,
			getItems: action,
			fetchGet: action,
			fetchAdd: action,
			fetchDelete: action,
			insert: action,
			remove: action,
		} );
	}

	getItems () {
		return this.items;
	}

	async fetchGet () {
		let result = await this.fetch( API.groups, 'GET' );
		runInAction( () => {
			if ( result.OK ) {
				this.items = result.groups;
				this.state = "done";
			}
		} );
	}

	async fetchAdd ( newGroup ) {
		const result = await this.fetch( API.groups, 'POST', JSON.stringify( newGroup ) );
		runInAction( () => {
			if ( result.OK ) {
				this.insert( result.created );
				this.state = "done";
			}
		} );

		return result;
	}

	async fetchDelete ( groupsIDsList ) {
		const result = await this.fetch( API.groups, 'DELETE', JSON.stringify( groupsIDsList ) )

		runInAction( () => {
			if ( result.OK ) {
				this.state = "done";
				groupsIDsList.forEach( groupId => {
					this.remove( groupId );
				} );
			}
		} );

		return result;
	}

	insert ( group ) {
		this.items.push( group );
	}

	remove ( groupId ) {
		this.items = this.items.filter( group => ( group._id !== groupId ) );
		ExaminationsStore.removeGroup( groupId );
	}
}

let groupStore = window.groupStore = new GroupsStore();
export default groupStore;