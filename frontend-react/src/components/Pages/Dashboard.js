import React, { Component } from "react";

import { Jumbotron } from "react-bootstrap";

import ProfileStore from "../../stores/profile";
import PageHeader from "../Layout/PageHeader";

export default class Dashboard extends Component {
	render() {
		const time = new Date().getHours();
		return (
			<div>
				<PageHeader name="Pulpit" />

				<Jumbotron className="mx-3">
					<h1>
						{time >= 6 && time < 12
							? "Dzień dobry"
							: time >= 12 && time < 18
							? "Witaj"
							: "Dobry wieczór"}
						<span className="ml-3">
							{ProfileStore.firstName ? ProfileStore.firstName : ProfileStore.displayName}
						</span>
					</h1>
				</Jumbotron>
			</div>
		);
	}
}
