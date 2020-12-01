import React, { Component } from "react";
import { HashRouter } from "react-router-dom";

import { observer } from "mobx-react";

import UserStore from "./stores/user";
import "./App.scss";

import Main from "./components/RoutesMain";
import Authenticate from "./components/RoutesAuthenticate";

import Errors from "./components/Layout/Errors";

class App extends Component {
	async componentDidMount() {
		await UserStore.checkAuthenticate();
	}

	render() {
		return (
			<HashRouter>
				{UserStore.state === "logged" ? <Main /> : <Authenticate />}
				<Errors />
			</HashRouter>
		);
	}
}

export default observer(App);
