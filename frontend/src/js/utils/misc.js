/**
 * Misc function
 * @module misc
 */

/**
 * Function which returns a minimum of two digits in case the value is less than 10
 * @param {number} value 
 */
const getTwoDigits = ( value ) => value < 10 ? `0${value}` : value;

/**
 * Return formated date YYYY-MM-DD
 * @param {Object<Date>} date 
 * @returns {String} - Formated date
 */
const formatDate = ( date ) => {
    const day = getTwoDigits( date.getDate() );
    const month = getTwoDigits( date.getMonth() + 1 ); // add 1 since getMonth returns 0-11 for the months
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

/**
 * Return formate time HH:MM (24 hours)
 * @param {Object<Date>} date 
 * @returns {String} - Formated time
 */
const formatTime = ( date ) => {
    const hours = getTwoDigits( date.getHours() );
    const mins = getTwoDigits( date.getMinutes() );

    return `${hours}:${mins}`;
}

module.exports = {
    getTwoDigits,
    formatDate,
    formatTime
}