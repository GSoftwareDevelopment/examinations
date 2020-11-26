import { makeAutoObservable } from "mobx";
// import { autorun } from 'mobx';
import { Form } from "react-bootstrap";

class ValidationStore {
	fields = [];

	constructor() {
		makeAutoObservable(this);
	}

	setField(componentName, fieldName, value) {
		let found = false;
		for (let field of this.fields) {
			if (field.component === componentName && field.name === fieldName) {
				field.value = value;
				found = true;
				break;
			}
		}
		if (found) return;
		this.fields.push({
			component: componentName,
			name: fieldName,
			value,
		});
	}

	getField(componentName, fieldName) {
		let componentFields = this.fields.filter((field) => field.component === componentName);
		if (fieldName) {
			let fields = componentFields.filter((item) => item.name === fieldName);
			return fields;
		} else return componentFields;
	}

	removeField(componentName, fieldName) {
		let newFields;
		if (fieldName)
			newFields = this.fields.filter(
				(field) => !(field.component === componentName && field.name === fieldName)
			);
		else newFields = this.fields.filter((field) => !(field.component === componentName));

		this.fields = newFields;
	}

	check(componentName, fieldName) {
		let valid = true;
		this.getField(componentName, fieldName).forEach((item) => {
			if (item.value !== true) {
				valid = false;
				return false;
			}
		});
		return valid;
	}

	formMessage(componentName, fieldName) {
		const invalidValues = this.getField(componentName, fieldName).filter(
			(item) => item.value !== false && item.value !== true
		);
		if (invalidValues.length > 0)
			return invalidValues.map((value) => (
				<Form.Text key={value.value} className="text-danger">
					{value.value}
				</Form.Text>
			));
		else return null;
	}
}

let validationStore = (window.validationStore = new ValidationStore());

// autorun( () => {
// 	console.log( '--- Validation store:' )
// 	validationStore.fields.forEach( field => {
// 		console.log( `${field.component}.${field.name}=${field.value}` )
// 	} )
// } );

export default validationStore;
