// recieving data in frontend

function getQueryParams() {
    const params = new URLSearchParams(window.location.search)
    const data = {}
    for (const [key, value] of params.entries()) {
        data[key] = value
    }
    return data
}

const data = getQueryParams()
document.getElementById('data').innerHTML = `
                                            DATA <br>
                                            <span>Name: ${data.name}</span><br>
                                            <span>Age: ${data.age}</span><br>
                                            <span>Gender: ${data.gender}</span>
                                             `