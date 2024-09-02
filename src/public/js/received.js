const showAll = document.getElementById('show-all')
const showLastRecord = document.getElementById('show-last-record')
const dataBase = document.getElementById('database')
const btnClearQuery = document.getElementById('clear-query')
const btnReturn = document.getElementById('btn-return')

btnReturn.addEventListener('click', () => {
    window.history.back()
})

showAll.addEventListener('click', () => {
    clearQuery()
    axios.get('/show-all')
        .then(response => {
            createTable(response.data)
        })
        .catch(error => {
            console.error('Erro na requisição GET com axios', error)
        })
})

showLastRecord.addEventListener('click', () => {
    clearQuery()
    axios.get('/show-last-user')
        .then(response => {
            createTable(response.data)
        })
        .catch(error => {
            console.log('error getting last record:', error)
        })
})

btnClearQuery.addEventListener('click', () => {
    clearQuery()
})

function clearQuery() {
    dataBase.innerHTML = ''
    table = document.createElement('table')
    tableRow = document.createElement('tr')
}

function createTable(responseData) {
    let table = document.createElement('table')
    let tableRow = document.createElement('tr')

    Object.keys(responseData[0]).forEach(key => {
        const th = document.createElement('th')
        th.textContent = key
        tableRow.appendChild(th)
    })

    table.appendChild(tableRow)

    responseData.forEach(item => {
        const row = document.createElement('tr')

        Object.values(item).forEach(value => {
            const td = document.createElement('td')
            td.textContent = value
            row.appendChild(td)
        })
        table.appendChild(row)
    })

    dataBase.appendChild(table)
}