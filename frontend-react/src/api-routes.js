const BASE_URL = "http://192.168.0.234:3000";

const API_URL = BASE_URL + "/api";
const AUTH_URL = BASE_URL + "/auth";

const ROUTES = {
	API_URL,
	authenticate: AUTH_URL + "/login",
	registerUser: AUTH_URL + "/register",
	userGet: API_URL + "/user",
	userUpdate: API_URL + "/user",

	examinationsCreate: API_URL + "/examinations/create",
	examinationsGet: API_URL + "/examinations",
	examinationsUpdate: API_URL + "/examinations/", // /examination/:id
	examinationsDelete: API_URL + "/examinations", //

	groupsCreate: API_URL + "/groups",
	groupsGet: API_URL + "/groups",
	groupsUpdate: API_URL + "/groups/", // /groups/:id
	groupsDelete: API_URL + "/groups", //
	measurementList: API_URL + "/measurements",
	measurementLatest: API_URL + "/measurements/latest",
	valuesList: API_URL + "/values",

	confExaminations: API_URL + "/examinations/configuration",
};
export default ROUTES;
