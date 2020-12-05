import { makeObservable, observable, action, runInAction } from "mobx";
import AuthenticateStore from "./authenticate";

class Fetcher {
	state = "done"; // "pending" / "done" / "error"
	error = null;
	__className = "Fetcher";

	constructor(className) {
		makeObservable(this, {
			state: observable,
			error: observable,
			getState: action,
			getError: action,
			clearError: action,
			fetch: action,
		});
		if (className) this.__className = className;
	}

	getState() {
		return this.state;
	}
	getError() {
		return this.error;
	}
	clearError() {
		runInAction(() => {
			this.state = "done";
			this.error = null;
		});
	}

	async fetch(uri, method, body) {
		this.state = "pending";

		if (AuthenticateStore.state !== "logged") {
			console.log(`Can't fetch data when user is not logged`);
			return { OK: 0 };
		}
		const token = AuthenticateStore.getToken();
		let result;
		let headers = {
			"Content-Type": "application/json",
			Authorization: "Bearer " + token,
		};

		if (body instanceof FormData) {
			delete headers["Content-Type"];
		}

		try {
			const res = await fetch(uri, {
				method,
				headers,
				body,
			});

			if (!res.ok) {
				let result = await res.text();
				throw new Error(result);
			}

			result = await res.json();

			runInAction(() => {
				if (result.OK) {
					this.state = "done";
				} else {
					console.error(`${this.__className} backend response error`, result);
					this.state = "error";
					this.error = {
						title: `${this.__className} backend response error`,
						msg: result.error.message,
						error: result.error,
					};
				}
			});

			return result;
		} catch (error) {
			runInAction(() => {
				console.error(`${this.__className} fetch error:`, error);
				this.state = "error";
				this.error = {
					title: `${this.__className} fetch error`,
					msg: error.message,
					error,
				};
			});
			return { OK: 0, error };
		}
	}
}

export default Fetcher;
