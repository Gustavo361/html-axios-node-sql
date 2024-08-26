const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname)))

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'users'
})

connection.connect((error) => {
    if (error) {
        console.log('connection error:', error)
    } else {
        console.log('connection established')
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/submit', (req, res) => {
    let name = req.body.name
    let age = req.body.age
    let gender = req.body.gender

    console.log('dados recebidos:', name, age, gender)

    // res.redirect(`/received?name=${name}&age=${age}&gender=${gender}`);
    res.redirect(`/received?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}&gender=${encodeURIComponent(gender)}`)
})

app.get('/received', (req, res) => {
    res.sendFile(path.join(__dirname, 'received.html'))
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});