const Authorization = {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem( 'token' ) }
}
export {
    Authorization
}