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
            url: '/groups',
            select: this.groupSelect,
            spinner: this.progress[ 'groupsFetching' ]
        } );
        this.examinations = new SelectFetch( {
            url: '/examinations?noHTML',
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
        this.resultsFields.find( 'fieldset.form-group' ).detach();
        this.resultsFields.find( 'div.form-group' ).detach();
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
                console.log( 'Error:', error );
            } );
    }

    makePattern ( values ) {
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
            let input, post;
            //div class="form-group row mr-1">
            let ctr = $( `<div class="form-group d-flex flex-row flex-wrap"/>` );
            let pre = $( `<label for="${value._id}" class="col-form-label">${value.name}</label>` )

            if ( typeof value.required === 'undefined' ) value.required = true;

            switch ( value.type ) {
                case 'numeric':
                    pre.addClass( 'col-6' );
                    input = $( `<input type="text" class="form-control col-3"/>` );
                    input.attr( 'id', value._id ).attr( 'name', 'value-' + value._id );
                    input.prop( 'required', value.required );

                    post = $( `<label class="pl-1 col-2 col-form-label">${value.unit}</label>` );
                    break;
                case 'text':
                    input = $( `<textarea class="form-control col-12"/>` );
                    input.attr( 'id', value._id ).attr( 'name', 'value-' + value._id );
                    input.prop( 'required', value.required );
                    break;
                case 'enum':
                    pre.addClass( 'col-6' );
                    input = $( `<select class="custom-select col-6"/>` );
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
                    break;
                case 'sets':
                    pre = null;
                    ctr = $( `<fieldset class="form-group ml-3" />` )
                        // to zdarzenie sprawdza, czy grupa oznaczona jako Wymagana
                        // spełnia warunek: Przynajmniej jeden wybrany.
                        // Jeżeli element (zdarzenia jest Checkbox'em) jest zaznaczony,
                        // wszystkie elementy oznaczane są jako Niewymagane
                        // ( poza elementem zaznaczonym )
                        // W przeciwnym wypadku, wszystkie element są oznaczane jako Wymgane.
                        .on( 'click', ( e ) => {
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
                    let leg = $( `<legend class="col-form-label col-6 pt-0">${value.name}</legend>` );
                    input = $( `<div class="row"/>` )
                    let div = $( `<div class="col-6 pl-0" />` )
                    value.list.split( ',' ).forEach( ( item ) => {
                        let ctr2 = $( `<div class="custom-control custom-checkbox" />` );
                        let id = `checkbox-${count}`;
                        let inp = $( `<input type="checkbox" class="custom-control-input" value="${item}" />` );
                        inp.attr( 'id', id ).attr( 'name', 'value-' + value._id );
                        inp.prop( 'required', value.required );
                        let lab = $( `<label for="${id}" class="custom-control-label">${item}</label>` );
                        ctr2.append( inp, lab );
                        div.append( ctr2 );
                        count++;
                    } );
                    input.append( leg );
                    input.append( div );
                    break;
            }


            ctr.append( pre );
            ctr.append( input );
            ctr.append( post );
            this.resultsFields.append( ctr );
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