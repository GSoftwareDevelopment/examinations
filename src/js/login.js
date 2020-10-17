import './../scss/progressbar.scss';
import './../scss/style.scss';

$( 'button' ).click( e => {
    $( 'button' ).addClass( 'disabled' );
    let target = $( e.currentTarget ),
        href = target.data( 'href' );

    $( '.progress' ).show();

    if ( href ) window.location = href;
} )
