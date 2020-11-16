import API from '../api-routes';
import { makeAutoObservable, runInAction } from 'mobx';
import UserStore from '../stores/user';
import ExaminationsStore from '../stores/examinations';

class GroupsStore {
    state = "pending"; // "pending" / "done" / "error"
    items = [];
    error = null;

    constructor() {
        makeAutoObservable( this );
    }

    getItems () {
        return this.items;
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
        this.items = [];
        this.state = "pending";

        if ( UserStore.state !== 'logged' ) {
            console.log( `Can't do operation 'fetchGet' when user is not logged` );
            return;
        }
        const token = UserStore.getToken();

        try {

            const res = await fetch( API.groups,
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
                    this.items = result.groups;
                    this.state = "done";
                } else {
                    console.error( 'Backend Error:', result )
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
                console.error( 'Fetch error', error );
                this.state = "error"
                this.error = {
                    title: 'Fetch error',
                    msg: error.message,
                    error
                }
            } )
        }

    }

    async fetchAdd ( newGroup ) {
        if ( UserStore.state !== 'logged' ) {
            console.log( `Can't do operation 'fetchAdd' when user is not logged` );
            return;
        }
        const token = UserStore.getToken();
        this.state = "pending";

        try {
            const res = await fetch( API.groups,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify( newGroup )
                } );

            let result = await res.json();

            runInAction( () => {
                if ( result.OK ) {
                    this.insert( result.created );
                    this.state = "done";
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
            } );

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

    async fetchDelete ( groupsIDsList ) {
        if ( UserStore.state !== 'logged' ) {
            console.log( `Can't do operation 'fetchDelete' when user is not logged` );
            return;
        }
        const token = UserStore.getToken();
        this.state = "pending";

        try {
            const res = await fetch( API.groups,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify( groupsIDsList )
                } );

            let result = await res.json();

            runInAction( () => {
                if ( result.OK ) {
                    this.state = "done";
                    groupsIDsList.forEach( groupId => {
                        this.remove( groupId );
                    } );
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
            } );

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