import API from '../api-routes';
import { makeAutoObservable, runInAction } from 'mobx';
import UserStore from '../stores/user';

class ExaminationsStore {
    state = "pending"; // "pending" / "done" / "error"
    items = [];

    constructor() {
        makeAutoObservable( this );
    }

    getItems () {
        return this.items;
    }

    getState () { return this.state }

    async fetchGet () {
        this.state = "pending";
        this.items = [];

        if ( UserStore.state !== 'logged' ) {
            console.log( `Can't do operation 'fetchGet' when user is not logged` );
            return;
        }
        const token = UserStore.getToken();

        try {

            const res = await fetch( API.examinations,
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
                    console.error( 'API Error', result );
                    this.state = "error";
                }
            } );

        } catch ( error ) {
            runInAction( () => {
                console.error( 'Fetch error:', error );
                this.state = "error";
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
            const res = await fetch( API.examinations, // 'http://localhost:3000/api/examinations',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify( newExamination )
                } );

            let result = await res.json();

            runInAction( () => {
                if ( result.OK ) {
                    this.state = "done";
                    this.insert( result.created.examinationEntry )
                }

                if ( result.error ) {
                    this.state = "error";
                    console.error( 'API Error:', result.error );
                }
            } )

            return result;
        } catch ( error ) {
            runInAction( () => {
                this.state = "error";
                console.error( 'Fetch error:', error );
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
            const res = await fetch( API.examinations, // 'http://localhost:3000/api/examinations',
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
                    console.log( 'API Error:', result.error );
                }
            } )

            return result;
        } catch ( error ) {
            runInAction( () => {
                this.state = "error";
                console.error( error );
            } )
            return false;
        }
    }

    insert ( examination ) {
        this.items.push( examination );
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