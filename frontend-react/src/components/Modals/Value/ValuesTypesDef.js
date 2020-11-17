import AttrNumeric from './AttrNumeric';
import AttrList from './AttrList';

export const ValuesTypesDef = [
	{
		type: 'numeric',
		name: 'Liczba',
		component: AttrNumeric,
		description: 'Typ numeryczny. Definiuje liczbę rzeczywistą jako wartość badania. Pozwala określić jednostę wprowadzanej liczby.',
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
		precedSubmit: ( value, attr ) => {
			value[ 'list' ] = [ ...attr.items ]
		},
	},
	{
		type: 'sets',
		name: 'Wielokrotny wybór',
		component: AttrList,
		description: 'Typ listy wyboru. Daje możliwość zaznaczenia kilku opcji z listy wielu elementów',
		precedSubmit: ( value, attr ) => {
			value[ 'list' ] = [ ...attr.items ]
		},
	}
]