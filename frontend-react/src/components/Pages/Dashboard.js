import React, { Component } from 'react'

import { Jumbotron } from 'react-bootstrap';

import UserStore from '../../stores/user';

export default class Dashboard extends Component {
	render () {
		const time = new Date().getHours();
		return (
			<div className="mx-3">
				<h4>Pulpit</h4>
				<Jumbotron>
					<h1>
						{time >= 6 && time < 12
							? "Dzień dobry"
							: time >= 12 && time < 18
								? "Witaj"
								: "Dobry wieczór"
						}
						<span className="ml-3">
							{UserStore.data.firstName
								? UserStore.data.firstName
								: UserStore.data.displayName}
						</span>
					</h1>
				</Jumbotron>
			</div>
		)
	}
}
