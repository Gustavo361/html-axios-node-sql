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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})

app.post('/login', (req, res) => {
    const userName = req.body['user-name']
    const userPassword = req.body['user-password']

    const sql = `SELECT * FROM app_users WHERE user_name = ? AND user_password = ?`

    connection.query(sql, [userName, userPassword], (error, results) => {
        if (error) {
            console.log('error finding the user during login')
            res.status(500).send('internal server error')
        } else {
            if (results.length > 0) {
                console.log('user and password found in the database, redirecting to home')
                res.sendFile(path.join(__dirname, 'index.html'))
            } else {
                console.log('error: incorrect or not found username or password')
                res.status(401).send('incorrect username or password')
            }
        }
    })
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

app.get('/sign-in', (req, res)=> {
    res.sendFile(path.join(__dirname, 'sign-in.html'))
})

app.post('/sign-in', (req, res) => {
    const userName = req.body['user-name']
    const userEmail = req.body['user-email']
    const userPassword = req.body['user-password']

    const sql = 'INSERT INTO app_users (user_name, user_password, user_email) values (?, ?, ?)'

    connection.query(sql, [userName, userPassword, userEmail], (error, results) => {
        if (error) {
            console.log('error', error)
            res.send('error saving user:', error)
        } else {
            console.log('User saved to the database successfully!', results)
            res.sendFile(path.join(__dirname, 'index.html'))
        }
    })
})

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000')
})