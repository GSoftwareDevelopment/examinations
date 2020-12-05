import React, { Component } from "react";
import AuthenticateStore from "../../../stores/authenticate";

import { Alert, Card, Button, Form } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

class RegisterForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayName: "",
			email: "",
			password: "",
			password2: "",
			buttonDisabled: true,
			redirect: false,
		};
	}

	componentDidMount() {
		AuthenticateStore.clearMessage();
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	isFormValid() {
		const { displayName, email, password, password2 } = this.state;

		let name = displayName.trim().split(" ");
		let correctName = name.length > 1;
		name.forEach((part) => {
			if (part.length === 0) {
				correctName = false;
			}
		});

		let mail = email.trim().split("@");
		let correctMail = true;
		if (mail.length === 2) {
			if (mail[0].length === 0) {
				correctMail = false; // no user name
			} else {
				const uri = mail[1].split(".");
				correctMail = uri.length > 1;
				uri.forEach((part) => {
					if (part.length === 0) {
						correctMail = false;
					}
				});
			}
		} else {
			correctMail = false;
		}

		return (
			correctName && correctMail && password !== "" && password2 !== "" && password === password2
		);
	}

	resetForm() {
		this.setState({
			displayName: "",
			email: "",
			password: "",
			password2: "",
			buttonDisabled: true,
		});
	}

	async doRegister(e) {
		e.preventDefault();

		const { displayName, email, password } = this.state;

		this.setState({ buttonDisabled: true });
		const result = await AuthenticateStore.register({ displayName, email, password });
		console.log("# Registration result:", result);
		if (result) {
			this.setState({ redirect: true });
		}
	}

	render() {
		return (
			<React.Fragment>
				{!this.state.redirect ? (
					<Form className="h-100 d-flex flex-column justify-content-center align-items-center">
						{AuthenticateStore.message !== "" && (
							<Alert variant="info">{AuthenticateStore.message}</Alert>
						)}
						<Card className="auth-card shadow-lg">
							<Card.Body>
								<Card.Title className="text-center">
									<strong>Rejestracja</strong>
								</Card.Title>
								<Card.Text as="div">
									<Form.Group>
										<Form.Label>Adres e-mail</Form.Label>
										<Form.Control
											type="email"
											autoFocus
											value={this.state.email}
											onChange={(e) => {
												this.setInputValue("email", e.target.value);
											}}
										/>
									</Form.Group>
									<Form.Group>
										<Form.Label>Imię i Nazwisko</Form.Label>
										<Form.Control
											type="displayName"
											value={this.state.displayName}
											onChange={(e) => {
												this.setInputValue("displayName", e.target.value);
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
									<Form.Group>
										<Form.Label>Potwierdź hasło</Form.Label>
										<Form.Control
											type="password"
											value={this.state.password2}
											onChange={(e) => {
												this.setInputValue("password2", e.target.value);
											}}
										/>
									</Form.Group>
								</Card.Text>
								<div className="card-footer">
									<Link to="/login">&lt; Wróć</Link>
									<Button
										type="submit"
										disabled={!this.isFormValid()}
										onClick={(e) => this.doRegister(e)}
									>
										Rejestruj
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Form>
				) : (
					<Redirect to="/login" />
				)}
			</React.Fragment>
		);
	}
}

export default RegisterForm;
