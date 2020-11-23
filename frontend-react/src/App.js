import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { observer } from "mobx-react";

import UserStore from "./stores/user";
import "./App.scss";

import Main from "./Main";
import Authenticate from "./Authenticate";
import SilentFetchBar from "./SilentFetchBar.js";
import Errors from "./Errors";

class App extends Component {
	async componentDidMount() {
		await UserStore.checkAuthenticate();
	}

	render() {
		return (
			<Router>
				{UserStore.state === "logged" ? <Main /> : <Authenticate />}
				<SilentFetchBar />
				<Errors />
			</Router>
		);
	}
}

export default observer(App);
