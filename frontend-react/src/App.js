import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { observer } from 'mobx-react';

import UserStore, { AuthorizeMessage } from './stores/user';
import ValuesStore from './stores/values';
import ExaminationsStore from './stores/examinations';
import GroupsStore from './stores/groups';

import './App.scss';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Modal } from 'react-bootstrap';

import AppNavbar from './components/Layout/AppNavbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

import Dashboard from './components/Pages/Dashboard';
import Profile from './components/Pages/Profile';
import Examinations from './components/Pages/Examinations';
import Measurements from './components/Pages/Measurements';

const ErrorHandle = observer( ( props ) => {
	const error=props.Store.getError();

	if ( props.Store.state === 'error' )
		return ( <Modal show={true}>
			<Modal.Header closeButton>
				<Modal.Title>{error.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			{error.msg}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary"
					onClick={() => { props.Store.clearError() }}
				>Close</Button>
			</Modal.Footer>
		</Modal> )
	else
		return null
} );


class App extends React.Component {

	async componentDidMount () {
		await UserStore.checkAuthenticate();
	}

	render () {
		return (
			<Router>
				{( UserStore.state === 'logged' )
					? <React.Fragment>
						<AppNavbar />
						<Scrollbars autohide="true">
							<main role="main" style={{ paddingTop: '4.5em' }}>
								<Switch>
									<Route exact path="/dashboard" component={Dashboard} />
									<Route exact path="/profile" component={Profile} />
									<Route exact path="/examinations" component={Examinations} />
									<Route exact path="/measurements" component={Measurements} />
									<Redirect to="/dashboard" />
								</Switch>
							</main>
						</Scrollbars>
					</React.Fragment>
					: ( UserStore.state === 'pending' )
						? <AuthorizeMessage />
						: <React.Fragment>
							<Switch>
								<Route exact path="/" component={LoginForm} />
								<Route exact path="/login" component={LoginForm} />
								<Route exact path="/register" component={RegisterForm} />
								<Redirect to="/" />
							</Switch>
						</React.Fragment>
				}
				{[ ExaminationsStore, GroupsStore, ValuesStore ]
					.map( ( Store, id ) => <ErrorHandle key={id} Store={Store} /> )}
			</Router>
		);
	}
}

export default observer( App );
