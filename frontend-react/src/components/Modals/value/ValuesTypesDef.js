import AttrNumeric from './AttrNumeric';
import AttrList from './AttrList';

const ValuesTypesDef = [
	{
		type: 'numeric',
		name: 'Liczba',
		component: AttrNumeric,
		description: 'Typ numeryczny. Definiuje liczbę rzeczywistą jako wartość badania. Pozwala określić jednostę wprowadzanej liczby.',
		symbolize: ( value ) => {
			if ( value.unit )
				return <span key="unit" className="mr-1">[{value.unit}]</span>
			else
				return null
		},
		precedSubmit: ( value, attr ) => {
			value[ 'unit' ] = attr.unit;
		},
	},
	{
		type: 'text',
		name: 'Tekst',
		component: null,
		description: 'Typ tekstowy. Jako wartość badania, przyjmowany jest tekst',
	},
	{
		type: 'enum',
		name: 'Pojedynczy wybór',
		component: AttrList,
		description: 'Typ listy wyboru. Pozwala na wybór jednej opcji z listy wielu elementów',
		symbolize: ( value ) => {
			if ( value.list )
				return (
					<span key="list" className="mr-1">{'{'}
						{value.list.map( ( item, id, arr ) => <span>
							<u key={"value-list-item-" + id} className="mx-1 ">{item}</u>
							{( id !== ( arr.length - 1 ) ) && <span>, </span>}
						</span> )}
						{'}'}</span>
				)
			else
				return null
		},
		precedSubmit: ( value, attr ) => {
			value[ 'list' ] = [ ...attr.items ]
		},
	},
	{
		type: 'sets',
		name: 'Wielokrotny wybór',
		component: AttrList,
		description: 'Typ listy wyboru. Daje możliwość zaznaczenia kilku opcji z listy wielu elementów',
		symbolize: ( value ) => {
			if ( value.list )
				return (
					<span key="list" className="mr-1">{'{'}
						{value.list.map( ( item, id, arr ) => <span>
							<u key={"value-list-item-" + id} className="mx-1 ">{item}</u>
							{( id !== ( arr.length - 1 ) ) && <span>, </span>}
						</span> )}
						{'}'}</span>
				)
			else
				return null
		},
		precedSubmit: ( value, attr ) => {
			value[ 'list' ] = [ ...attr.items ]
		},
	}
];

function getNameByType ( ValueType ) {
	const valueDef = ValuesTypesDef.find( ( v => v.type === ValueType ) );
	if ( valueDef )
		return valueDef.name
	else
		return null
}

export {
	ValuesTypesDef,
	getNameByType,
}