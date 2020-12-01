import { makeAutoObservable, runInAction } from "mobx";
import React, { Component } from "react";
import { Spinner } from "react-bootstrap";

import API from "../api-routes";

class UserStore {
	state = "pending"; // "pending" / "logged" / "nologged" / "error"
	data = null;
	message = "";

	constructor() {
		makeAutoObservable(this);
	}

	clearMessage() {
		this.message = "";
		this.state = "done";
	}

	getToken() {
		return localStorage.getItem("token");
	}
	setToken(value) {
		localStorage.setItem("token", value);
	}
	removeToken() {
		localStorage.removeItem("token");
	}

	/**
	 * Chect Authentication method
	 */
	async checkAuthenticate() {
		const token = this.getToken();
		this.state = "pending";
		this.data = null;

		let result, res;

		console.log("Checking authentication...");
		if (token) {
			console.log("...getting user information...");
			try {
				res = await fetch(API.userGet, {
					// 'http://localhost:3000/api/user'
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
				});

				if (res.ok) {
					result = await res.json();

					if (result.error) {
						runInAction(() => {
							console.log("Authentication error", result.error);
							this.message = result.error;
							this.state = "nologged";
						});
					} else {
						runInAction(() => {
							console.log("Authentication successfull");
							this.state = "logged";
							this.data = { ...result };
						});
					}
				} else {
					runInAction(() => {
						if (res.status === 401) {
							console.log("User is not authenticated.");
							this.state = "nologged";
						} else {
							this.state = "error";
							console.log(res);
						}
					});
				}
			} catch (error) {
				runInAction(() => {
					console.log("Fetch error", error, res);
					this.state = "error";
					this.message = "The authorization token cannot be verified. You have been logged out.";
					this.removeToken();
					this.data = null;
				});
			}
		} else {
			console.log("...token not found");
			runInAction(() => {
				this.state = "nologged";
				this.message = "";
			});
		}
	}

	/**
	 * Login method
	 * @param {*} username
	 * @param {*} password
	 */
	async login(username, password) {
		console.log("Logging user...");
		this.state = "pending";
		this.data = null;
		this.message = "";

		try {
			const res = await fetch(
				API.authenticate, // 'http://localhost:3000/auth/login',
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: username,
						password: password,
					}),
				}
			);

			console.log(res);
			let result = await res.json();

			if (result && result.token) {
				runInAction(() => {
					console.log("User sucessfull logged");
					this.state = "logged";
					this.setToken(result.token);
					this.data = result.user;
					this.message = "";
				});
				return true;
			} else if (result && result.message) {
				runInAction(() => {
					console.log(`Authentication error:`, result.message);
					this.state = "nologged";
					this.message = result.message;
				});
				return false;
			}
		} catch (error) {
			runInAction(() => {
				this.state = "error";
				console.log("Fetch error:", error);
				this.message = "Connection error. Unable to login.";
			});
			return false;
		}
	}

	/**
	 * Logout method
	 */
	logout() {
		console.log("User is logout");
		this.state = "nologged";
		this.message = "";
		this.removeToken();
		this.data = null;
	}

	/**
	 * Register method
	 */
	async register(UserRegisterData) {
		console.log("Register new user...");
		try {
			const res = await fetch(API.registerUser, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(UserRegisterData),
			});

			console.log(res);
			let result = await res.json();

			if (result.OK) {
				runInAction(() => {
					console.log("User successfull registered");
					this.state = "registered";
					this.message = "User is successfull registered! Now you can log in";
				});
				return true;
			} else if (result && result.message) {
				runInAction(() => {
					console.log("Registration error:", result.message);
					this.state = "error";
					this.message = result.message;
				});
				return false;
			}
		} catch (error) {
			runInAction(() => {
				this.state = "error";
				this.message = error;
				console.log("Fetch error:", error);
			});
		}
	}
}

export class AuthorizeMessage extends Component {
	state = {
		visible: false,
	};

	timerHandle = null;

	componentDidMount() {
		this.timerHandle = setTimeout(() => {
			this.setState({ visible: true });
			console.log("turn on message...");
			clearTimeout(this.timerHandle);
			this.timerHandle = null;
		}, 1000);
	}

	componentWillUnmount() {
		if (this.timerHandle) {
			clearTimeout(this.timerHandle);
			this.timerHandle = null;
		}
	}

	render() {
		if (this.state.visible) {
			return (
				<div className="d-flex flex-row justify-content-center align-items-center w-100 h-100">
					<div>
						<Spinner animation="border" role="status" /> Checking Authentication...
					</div>
				</div>
			);
		} else return null;
	}
}

let userStore = (window.userStore = new UserStore());
export default userStore;
