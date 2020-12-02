import React, { Component } from "react";
import UserStore from "../../../stores/user";

import { Alert, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

class LoginForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			buttonDisabled: false,
		};
	}

	setInputValue(property, val) {
		val = val.trim();
		this.setState({ [property]: val });
	}

	resetForm() {
		this.setState({
			username: "",
			password: "",
			buttonDisabled: false,
		});
	}

	async doLogin(e) {
		e.preventDefault();

		const { username, password } = this.state;

		this.setState({ buttonDisabled: true });
		await UserStore.login(username, password);
	}

	render() {
		return (
			<Form className="h-100 d-flex flex-column justify-content-center align-items-center">
				{UserStore.message !== "" && (
					<Alert variant="info" className="text-center">
						{UserStore.message}
					</Alert>
				)}
				<Card className="auth-card shadow-lg">
					<Card.Body>
						<Card.Title className="text-center">
							<strong>Logowanie</strong>
						</Card.Title>
						<Card.Text as="div">
							<Form.Group>
								<Form.Label>Adres e-mail</Form.Label>
								<Form.Control
									type="email"
									autoFocus
									value={this.state.username}
									onChange={(e) => {
										this.setInputValue("username", e.target.value);
									}}
								/>
							</Form.Group>
							<Form.Group>
								<Form.Label>Twoje hasło</Form.Label>
								<Form.Control
									type="password"
									value={this.state.password}
									onChange={(e) => {
										this.setInputValue("password", e.target.value);
									}}
								/>
							</Form.Group>
						</Card.Text>
						<div className="card-footer">
							<Button
								type="submit"
								disabled={this.state.buttonDisabled}
								onClick={(e) => this.doLogin(e)}
							>
								Loguj
							</Button>
							<div>
								<Link to="/register">Zarejestruj</Link>
							</div>
						</div>
					</Card.Body>
				</Card>
			</Form>
		);
	}
}

export default LoginForm;
