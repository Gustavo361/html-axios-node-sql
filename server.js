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
        console.log('successfully connected to MySQL database!')
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/submit', (req, res) => {
    let name = req.body.name
    let age = req.body.age
    let gender = req.body.gender

    const sql = 'INSERT INTO simple_users (user_name, user_age, user_gender) VALUES (?,?,?)'

    connection.query(sql, [req.body.name, req.body.age, req.body.gender], (error, results) => {
        if (error) {
            console.error('error inserting data', error)
            res.status(500).send('Error saving data')
            return
        }
        console.log('success saving data:', results)
        // res.redirect(`/received?name=${name}&age=${age}&gender=${gender}`)
        res.redirect(`/received?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}&gender=${encodeURIComponent(gender)}`)
    })
})

app.get('/received', (req, res) => {
    res.sendFile(path.join(__dirname, 'received.html'))
})

app.get('/show-last-user', (req, res) => {
    const sql = 'SELECT * FROM simple_users ORDER BY id DESC LIMIT 1'

    connection.query(sql, (error, results)=>{
        if (error) {
            console.log('error getting last record', error)
        } else {
            res.send(results)
        }
    })
})

app.get('/show-all', (req, res) => {
    console.log('entrou no get show-all')
    const sql = 'SELECT * FROM simple_users'

    connection.query(sql, (error, results)=>{
        if (error) {
            console.error('error getting all data from MySQL database', error)
        } else {
            console.log('response: ', results)
            res.send(results)
        }
    })
})

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000')
})