import 'gsd-minix/components/progressbar.scss';

$( 'button' ).click( e => {
    $( 'button' ).addClass( 'disabled' );
    let target = $( e.currentTarget ),
        href = target.data( 'href' );

    $( '.progress' ).show();

    if ( href ) window.location = href;
} )
