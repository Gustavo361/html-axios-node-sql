const formLogin = document.getElementById('form-login');
const userName = document.getElementById('user-name');
const userPassword = document.getElementById('user-password');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    let userNameValue = userName.value;
    let userPasswordValue = userPassword.value;

    axios.post('/login', {
        'user-name': userNameValue,
        'user-password': userPasswordValue
    })
    .then(response => {
        console.log(response);
        if (response.status === 200) {
            console.log('Seria redirecionado para index');
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('error', error);
    });
});
