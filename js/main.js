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
  // document.cookie = 'token=hellosteve';
  // document.cookie = 'token=; Max-Age=0';
  // document.cookie = 'token=; Expires=Thu Jan 1, 1970T00:00:00GMT';
  // sessionStorage.setItem('CheeseOmelette', 'hellosteve');
  checkForToken(); // in cookies
  const token = checkForTokenInSession(); //in sessionStorage
  log(token); //false or the actual token string
  if (token) {
    //check if the user token is valid
    checkValidUser(token);
  }
  document.querySelector('form').addEventListener('submit', attemptLogin);
  document.getElementById('btnLogout').addEventListener('click', attemptLogout);
}

function attemptLogout(ev) {
  //don't need prevent default because not in a form
  sessionStorage.removeItem('CheeseOmelette');
  document.cookie = 'token=; Max-Age=0';

  updateUI('', 'red');
  //ALSO REMOVE ANY DATA INSIDE THE CONTENT AREA
}

function attemptLogin(ev) {
  ev.preventDefault(); //stop the form reloading the page
  const formData = new FormData(ev.target);
  const loginData = {
    username: formData.get('username'),
    password: formData.get('password'), //referencing the name of the form elements
  };
  const jsonLoginData = JSON.stringify(loginData); // the body of our Request
  const url = new URL(`${baseAuthURL}${loginEndpoint}`); //  /auth/login
  const req = new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-TGIF': 'true', //No Authorization header here...
    },
    body: jsonLoginData,
  });
  fetch(req)
    .then((response) => {
      if (!response.ok) throw new Error(`Bad Login Attempt ${response.status}`);
      return response.json();
    })
    .then((data) => {
      //logged in
      let firstName = data.firstName;
      let lastName = data.lastName;
      let t = data.accessToken; //don't need this really...
      updateUI(`Hello ${firstName} ${lastName}`, 'green');
      //SAVE TOKEN in cookie or sessionStorage
      document.cookie = `token=${t}`;
      //ONLY NEED ONE OF THESE
      sessionStorage.setItem('CheeseOmelette', t);

      //reset the Form
      ev.target.reset();
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

function checkValidUser(token) {
  const url = new URL(`${baseAuthURL}${authEndpoint}`);
  const req = new Request(url, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  fetch(req)
    .then((response) => {
      if (!response.ok) throw new Error(`Bad Auth request: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      log(data);
      let firstName = data.firstName;
      let lastName = data.lastName;
      let t = data.accessToken; //don't need this really...
      updateUI(`Hello ${firstName} ${lastName}`, 'green');
    })
    .catch((err) => {
      console.warn(err.message);
    });
}

function updateUI(nameString, bodyClass) {
  // 'Hello Simon Smith', 'green'
  // '', 'red'
  let h2 = document.querySelector('header h2');
  h2.textContent = nameString; //display their name
  document.body.className = bodyClass; //show the private logged in part
}

function checkForToken() {
  //check to see if there is a token in the cookies
  const cookies = document.cookie;
  if (cookies == '') return false; //no token
  const parts = cookies.split('; '); //there is '; ' between each
  const str = parts.find((part) => part.startsWith('token='));
  // looking for something like 'token=ey897sd9f87as9f8d79s78df9s7'
  // str could also be undefined
  if (str == undefined) return false;
  const token = str.split('=')[1]; //the part after the '='
  return token;
}
function checkForTokenInSession() {
  //check in sessionStorage for a token
  const str = sessionStorage.getItem('CheeseOmelette');
  //or whatever name you want to use
  if (!str) return false;
  return str;
}
