const formSubmit = document.getElementById('submit-form')

formSubmit.addEventListener('submit', (e) => {
    e.preventDefault()

    let nameValue = document.getElementById('name').value
    let ageValue = document.getElementById('age').value
    let genderValue = document.querySelector('input[name="gender"]:checked').value

    axios.post('/submit', {
        "name": nameValue,
        "age": ageValue,
        "gender": genderValue
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        }
    }).then(() => {
        window.location.href = '/received'
    })
    .catch(error => {
        console.log("Error submitting data:", error)
    })
})