// we're going to be listening for the submit event from the form
// async/await acts as 'syntactic sugar' --> helps make Promises more readable
// async is added before the function
async function signUpFormHandler(event) {
    event.preventDefault();

    // we need to POST the username, email, and password from the form to our server
    // grab data from form
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // make a fetch() POST request to the /api/users/
    // added conditional to make sure all fiels have values before making the POST request
    if (username && email && password) {
        // await is added before the Promise
        // when using await, we can assign the result of the promise to a variable (i.e. const response = await fetch();); this way, we don't need to use catch() or then() to tell the code what to do after the Promise completes
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        // after implementing the response variable, now we can add error handling by using the .ok property on the response object
        if (response.ok) {
            // if the response is successful, we'll console.log('success')
            console.log('sucess');
        } else {
            // otherwise, we'll alert() the error
            alert(response.statusText);
        }
    }
}

async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signUpFormHandler);

