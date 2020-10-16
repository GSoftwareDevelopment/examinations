// Function which returns a minimum of two digits in case the value is less than 10
const getTwoDigits = ( value ) => value < 10 ? `0${value}` : value;

const formatDate = ( date ) => {
    const day = getTwoDigits( date.getDate() );
    const month = getTwoDigits( date.getMonth() + 1 ); // add 1 since getMonth returns 0-11 for the months
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

const formatTime = ( date ) => {
    const hours = getTwoDigits( date.getHours() );
    const mins = getTwoDigits( date.getMinutes() );

    return `${hours}:${mins}`;
}

export {
    getTwoDigits,
    formatDate,
    formatTime
}