const form = document.getElementById('sign-up')
const userName = document.getElementById('user-name')
const userEmail = document.getElementById('user-email')
const userPassword = document.getElementById('user-password')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    let userNameValue = userName.value
    let userEmailValue = userEmail.value
    let userPasswordValue = userPassword.value

    axios.post('sign-up', {
        "user-name": userNameValue,
        "user-email": userEmailValue,
        "user-password": userPasswordValue
    })
        .then(() => {
            window.location.href = '/'
        }
        )
        .catch(
            error => {
                console.error('error', error)
            }
        )
})