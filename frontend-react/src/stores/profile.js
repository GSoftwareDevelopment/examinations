import API from "../api-routes";
import { makeObservable, observable, action, runInAction } from "mobx";
import Fetcher from "./Fetcher";

class ProfileStore extends Fetcher {
	displayName = "";
	firstName = "";
	lastName = "";
	email = "";
	image = "";

	constructor() {
		super(`Profile`);
		makeObservable(this, {
			displayName: observable,
			firstName: observable,
			lastName: observable,
			image: observable,
			fetchUpdate: action,
			update: action,
		});
	}

	async fetchUpdate(profileData) {
		const fd = new FormData();
		fd.append("displayName", profileData.displayName);
		fd.append("firstName", profileData.firstName);
		fd.append("lastName", profileData.lastName);
		fd.append("image", profileData.imageFile);

		const result = await this.fetch(API.userUpdate, "POST", fd);

		runInAction(() => {
			if (result.OK) {
				this.update(result.updated);
				this.state = "ready";
			}
		});

		return result;
	}

	update(profileData) {
		if (profileData.displayName) this.displayName = profileData.displayName;
		if (profileData.firstName) this.firstName = profileData.firstName;
		if (profileData.lastName) this.lastName = profileData.lastName;
		if (profileData.email) this.email = profileData.email;
		if (profileData.image) this.image = profileData.image;
	}
}

let profileStore = (window.profileStore = new ProfileStore());
export default profileStore;
