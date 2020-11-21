import API from "../api-routes";
import { makeObservable, observable, action, runInAction } from "mobx";
import Fetcher from "./Fetcher";
import ExaminationsStore from "../stores/examinations";

class GroupsStore extends Fetcher {
	items = [];

	constructor() {
		super(`Groups`);
		makeObservable(this, {
			items: observable,
			getItems: action,
			fetchGet: action,
			fetchAdd: action,
			fetchDelete: action,
			insert: action,
			update: action,
			remove: action,
		});
	}

	getItems() {
		return this.items;
	}
	getByID(groupId) {
		return this.items.find((item) => item._id === groupId);
	}
	async fetchGet() {
		let result = await this.fetch(API.groupsGet, "GET");
		runInAction(() => {
			if (result.OK) {
				this.items = result.groups;
				this.state = "done";
			}
		});
	}

	async fetchAdd(newGroup) {
		const result = await this.fetch(
			API.groupsCreate,
			"POST",
			JSON.stringify(newGroup)
		);
		runInAction(() => {
			if (result.OK) {
				this.insert(result.created);
				this.state = "done";
			}
		});

		return result;
	}

	async fetchUpdate(groupId, groupData) {
		const result = await this.fetch(
			API.groupsUpdate + groupId,
			"POST",
			JSON.stringify(groupData)
		);

		runInAction(() => {
			if (result.OK) {
				this.state = "done";
				this.update(groupId, groupData);
			}
		});

		return result;
	}

	async fetchDelete(groupsIDsList) {
		const result = await this.fetch(
			API.groupsDelete,
			"DELETE",
			JSON.stringify(groupsIDsList)
		);

		runInAction(() => {
			if (result.OK) {
				this.state = "done";
				groupsIDsList.forEach((groupId) => {
					this.remove(groupId);
				});
			}
		});

		return result;
	}

	insert(group) {
		this.items.push(group);
	}

	update(groupId, groupData) {
		runInAction(() => {
			this.items.forEach((group, index) => {
				if (group._id !== groupId) return;

				this.items[index] = {
					...group,
					...groupData,
				};
			});
		});
	}

	remove(groupId) {
		this.items = this.items.filter((group) => group._id !== groupId);
		ExaminationsStore.removeGroup(groupId);
	}
}

let groupsStore = (window.groupsStore = new GroupsStore());
export default groupsStore;
