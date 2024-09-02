const btnLogOut = document.getElementById('log-out');

btnLogOut.addEventListener('click', () => {
    axios.post('/logout', {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 200) {
            console.log('Logout successful');
            window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
});
