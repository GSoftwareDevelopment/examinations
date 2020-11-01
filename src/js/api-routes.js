const API_URL = "http://localhost:3000/api";

module.exports = {
    API_URL,
    userData: API_URL + "/user",
    examinationList: API_URL + "/examinations",
    groupsList: API_URL + "/groups",
    measurementList: API_URL + "/measurements",
    measurementLatest: API_URL + "/measurements/latest",
    valuesList: API_URL + "/values",

    confExaminations: API_URL + '/examinations/configuration',
}