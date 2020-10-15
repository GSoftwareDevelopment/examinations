class AddMeasurement extends Dialog {
    constructor() {
        super( 'addMeasurement' );

        $( this.forms[ 'form' ] )
            .on( 'submit', ( e ) => { this.submit( e ); } );

        this.date = $( this.forms[ 'form' ] ).find( '#date' );
        this.time = $( this.forms[ 'form' ] ).find( '#time' );

        this.groupSelect = $( this.forms[ 'form' ] )
            .find( '#group' )
            .on( 'change', ( e ) => { this.changeGroup( e ); } );

        this.examinationSelect = $( this.forms[ 'form' ] )
            .find( '#examination' )
            .on( 'change', ( e ) => { this.changeExamination( e ); } );

        this.groups = new SelectFetch( {
            url: '/groups?data',
            select: this.groupSelect,
            spinner: this.progress[ 'groupsFetching' ]
        } );
        this.examinations = new SelectFetch( {
            url: '/examinations?data',
            select: this.examinationSelect,
            spinner: this.progress[ 'examinationsFetching' ]
        } );

        // this.pattern = $( this.dialog ).find( 'div#pattern' );

        this.resultsFields = $( this.dialog ).find( 'div#results' );
    }

    showDialog ( e ) {
        super.showDialog();
        this.clearResultsFields();

        const currentDate = new Date();

        this.date[ 0 ].value = formatDate( currentDate );
        this.time[ 0 ].value = formatTime( currentDate );

        this.getGroupsList();
        this.getExaminationsList();
    }

    clearResultsFields () {
        this.resultsFields.empty();
    }

    changeGroup ( e ) {
        const groupID = e.currentTarget.value;
        this.clearResultsFields();

        this.examinationSelect
            .find( 'option, optgroup' )
            .each( ( i, el ) => {
                const elGroup = $( el ).data( 'group' );
                if ( typeof elGroup !== 'undefined' ) {
                    if ( groupID === '' || elGroup === groupID ) {
                        $( el ).removeClass( 'd-none' );
                    } else {
                        $( el ).addClass( 'd-none' )
                    }
                    $( el ).prop( 'selected', false );
                }
            } );

        this.examinationSelect.find( 'option[data-type="prompt"]' ).attr( 'selected', true );
    }

    changeExamination ( e ) {
        const examinationID = e.currentTarget.value;
        console.log( examinationID );
        this.getExaminationValues( examinationID );
    }

    getGroupsList () {
        this.groups.getData()
            .then( ( data ) => {
                if ( !data ) return;

                data.forEach( ( entry ) => {
                    let item = $( `<option class="item" value="${entry._id}">${entry.name}</option>` );
                    this.groupSelect.append( item );
                } );
            } );
    }

    getExaminationsList () {
        this.examinations.getData()
            .then( ( data ) => {
                if ( !data ) return;

                data.forEach( ( entry ) => {
                    const name = `${entry.name}`;
                    let item = $( `<option class="item" ${entry.group ? `data-group="${entry.group._id}"` : `data-group=""`} value="${entry._id}">${name}</option>` );
                    this.examinationSelect.append( item );
                } );
            } );

    }

    getExaminationValues ( examinationID ) {
        fetch( `/values/${examinationID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        } )
            .then( response => response.json() )
            .then( values => {
                this.makePattern( values );
                this.createResultsFields( values );
            } )
            .catch( ( error ) => {
                console.error( 'Error:', error );
            } );
    }

    makePattern ( values ) { // TODO: Usuń to
        const symbolize = ( value ) => {
            switch ( value.type ) {
                case 'numeric':
                    return `#${value.name}[${value.unit}]`;
                case 'text':
                    return `"${value.name}"`;
                case 'enum':
                    return `=${value.name}[${value.list.split( ',' ).join( '|' )}]`;
                case 'sets':
                    return `=${value.name}{${value.list}}`;
            }
        }

        let pattern;
        pattern = values.reduce( ( prev, curr, index ) => {
            if ( index == 1 ) {
                return symbolize( prev ) + ' ' + symbolize( curr );
            } else {
                return prev + ' ' + symbolize( curr );
            }
        } );
        if ( typeof pattern === 'object' ) {
            pattern = symbolize( values[ 0 ] );
        }
        $( this.pattern ).text( pattern );

    }

    createResultsFields ( values ) {
        this.clearResultsFields();

        let count = 0; // counter for unique checkbox id
        values.forEach( ( value ) => {

            let input;
            let ctr = $( `<div class="value-row" />` );
            let label = $( `<label for="${value._id}" class="m-0 p-0 pt-1 pl-1">${value.name}</label>` )

            let inpctr = $( `<div class="d-flex flex-row align-items-center justify-content-end" />` );

            if ( typeof value.required === 'undefined' ) value.required = true;

            switch ( value.type ) {
                case 'numeric':
                    input = $( `<input type="text" class="form-control field-number"/>` );
                    input.attr( 'id', value._id ).attr( 'name', 'value-' + value._id );
                    input.prop( 'required', value.required );

                    let unit = $( `<label for="${value._id}" class="number-unit p-0 m-0 pl-1">${value.unit}</label>` );

                    inpctr.append( input, unit );
                    break;
                case 'text':
                    input = $( `<textarea class="form-control"/>` );
                    input.attr( 'id', value._id ).attr( 'name', 'value-' + value._id );
                    input.prop( 'required', value.required );

                    inpctr.append( input );
                    break;
                case 'enum':
                    input = $( `<select class="custom-select field-enum"/>` );
                    input.attr( 'id', value._id ).attr( 'name', 'value-' + value._id );
                    input.prop( 'required', value.required );

                    input.append( $( `<option value="" selected disabled>Wybierz...</option>` ) )

                    value.list.split( ',' ).forEach( ( item ) => {
                        input.append( $( `<option value="${item}">${item}</option>` ) )
                    } );

                    if ( !value.required ) {
                        input.append( $( `<option disabled>---</option>` ) )
                        input.append( $( `<option value="">* nie dotyczy</option>` ) )
                    }

                    inpctr.append( input );
                    break;
                case 'sets':
                    let fieldset = $( `<fieldset class="form-group ml-3" />` )
                        .on( 'click', ( e ) => {
                            // to zdarzenie sprawdza, czy grupa oznaczona jako Wymagana
                            // spełnia warunek: Przynajmniej jeden wybrany.
                            // Jeżeli element (zdarzenia jest Checkbox'em) jest zaznaczony,
                            // wszystkie elementy oznaczane są jako Niewymagane
                            // ( poza elementem zaznaczonym )
                            // W przeciwnym wypadku, wszystkie element są oznaczane jako Wymgane.
                            const selected = e.target; // wybrany element
                            if ( selected.tagName !== "INPUT" || selected.type !== "checkbox" )
                                return;

                            const grp = $( e.delegateTarget ).find( 'input[type="checkbox"]' );

                            let isRequired = false,
                                isChecked = false;
                            grp.each( ( id, el ) => {
                                if ( el.checked ) isChecked = true;
                                if ( el.required ) isRequired = true;
                            } );
                            if ( !isRequired ) return;

                            if ( isChecked ) {
                                grp.each( ( id, el ) => { el.required = el.checked; } );
                            } else {
                                grp.each( ( id, el ) => { el.required = true; } );
                            }

                        } );

                    value.list.split( ',' ).forEach( ( item ) => {
                        let ctr2 = $( `<div class="custom-control custom-checkbox field-sets" />` );
                        let id = `checkbox-${count}`;
                        let inp = $( `<input type="checkbox" class="custom-control-input" value="${item}" />` );
                        inp.attr( 'id', id ).attr( 'name', 'value-' + value._id );
                        inp.prop( 'required', value.required );
                        let lab = $( `<label for="${id}" class="custom-control-label">${item}</label>` );
                        ctr2.append( inp, lab );
                        fieldset.append( ctr2 );
                        count++;
                    } );

                    inpctr.append( fieldset );
                    break;
            }

            const commentBtn = $( `
<button type="button" class="m-0 mx-1 px-2 py-1 btn btn-flat shadow-none waves-effect" data-descid="${value._id}">
    <svg viewBox="0 0 16 16" class="bi bi-chat-left-text" fill="currentColor">
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path fill-rule="evenodd" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
    </svg>
</button>`);
            commentBtn.on( 'click', ( e ) => {
                const descID = $( e.currentTarget ).data( 'descid' );
                $( `textarea[name='description-${descID}']` ).toggleClass( 'd-none' );
            } );

            inpctr.append( commentBtn );


            ctr.append( label );
            ctr.append( inpctr );

            this.resultsFields.append( ctr );

            const commentField = $( `<textarea class="d-none form-control mb-3" name="description-${value._id}" />` );
            this.resultsFields.append( commentField );
        } )
    }

    async submit ( e ) {
        e.preventDefault();

        if ( this.forms[ 'form' ].checkValidity() === false ) {
            e.stopPropagation();
            this.forms[ 'form' ].classList.add( 'was-validated' );
        } else {
            this.disableForm( 'form' );
            $( this.progress[ 'formSend' ] ).show();

            let fields = $( this.forms[ 'form' ] ).serialize();

            console.log( fields );

            try {
                let response = await fetch( '/measurements', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: fields,
                } );
                const result = await response.json()
                console.log( result );
                if ( !result.error ) {
                    window.location = "/measurements";
                    return;
                } else {
                    this.enableForm( 'form' );
                    $( this.progress[ 'formSend' ] ).hide();
                }

            } catch ( error ) {
                console.log( error );
            }

        }
    }
}

const modal_AddMeasurement = new AddMeasurement();