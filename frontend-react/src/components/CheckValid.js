import React from 'react'

import { Form } from 'react-bootstrap';

/**
 *
 * @param {*} props
 * @param {string} props.field
 * @param {Object} props.validate
 */
export default function CheckValid ( props ) {
	const fields = props.validate.filter( item => item.field === props.field );
	if ( fields.length > 0 )
		return fields.map( ( field, id ) =>
			<Form.Text key={"validation-error-" + id} className="text-danger">{field.message}</Form.Text> )
	else
		return null;
}