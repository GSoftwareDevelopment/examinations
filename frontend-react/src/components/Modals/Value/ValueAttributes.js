/*eslint no-duplicate-case: "off"*/

import React, { Component } from 'react'

import { defineTypes } from './DefineTypes';

class ValueAttributes extends Component {
	constructor( props ) {
		super( props );
		this.state = {};
	}

	handleAttributes ( data ) {
		this.props.attributes( data );
	}

	render () {
		let typeDef = defineTypes.filter( type => type.type === this.props.type )
		if ( typeDef.length > 0 ) {
			const Attr = typeDef[ 0 ].component;
			if ( Attr )
				return (
					<Attr
						setTo={this.props.setTo ? this.props.setTo : null}
						attributes={( data ) => { this.handleAttributes( data ) }} />
				)
			else
				return null;
		}
		console.error( 'Type definition not found!' )
		return null
	}
}

export default ValueAttributes