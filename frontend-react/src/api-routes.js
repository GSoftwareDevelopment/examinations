const BASE_URL = "http://192.168.0.234:3000";

const API_URL = BASE_URL + "/api";
const AUTH_URL = BASE_URL + "/auth";

const ROUTES = {
	API_URL,
	authenticate: AUTH_URL + "/login",
	registerUser: AUTH_URL + "/register",
	userData: API_URL + "/user",
	examinations: API_URL + "/examinations",
	groups: API_URL + "/groups",
	measurementList: API_URL + "/measurements",
	measurementLatest: API_URL + "/measurements/latest",
	valuesList: API_URL + "/values",

	confExaminations: API_URL + '/examinations/configuration',
}
export default ROUTES