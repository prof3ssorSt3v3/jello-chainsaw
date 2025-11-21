const log = console.log;
const baseAuthURL = 'https://dummyjson.com';
const loginEndpoint = '/auth/login'; //username and password to get token
const authEndpoint = '/auth/me'; //use token to get first and last name

const baseDataURL = 'https://jsonplaceholder.typicode.com';
const dataEndpoint = '/users'; //get some data for the page

document.addEventListener('DOMContentLoaded', init);

function init() {
  //DOM ready
  document.body.className = 'red'; //by default... not logged in
}
