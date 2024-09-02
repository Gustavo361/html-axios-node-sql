const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const cookieParser = require('cookie-parser')

const userAuthentication = require('./src/middlewares/user.authentication')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname)))
app.use(userAuthentication)

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
    res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'login.html'))
})

app.post('/login', (req, res) => {
    const userName = req.body['user-name']
    const userPassword = req.body['user-password']

    const sql = `SELECT * FROM app_users WHERE user_name = ? AND user_password = ?`

    connection.query(sql, [userName, userPassword], (error, results) => {
        if (error) {
            res.status(500).send('internal server error')
        } else {
            if (results.length > 0) {

                const token = jwt.sign({ id: results[0].id }, JWT_SECRET, { expiresIn: '5min' })
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Lax',
                    maxAge: 300000
                }).redirect('/')
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
        res.redirect('/received')
    })
})

app.get('/received', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'received.html'))
})

app.get('/show-last-user', (req, res) => {
    const sql = 'SELECT * FROM simple_users ORDER BY id DESC LIMIT 1'

    connection.query(sql, (error, results) => {
        if (error) {
            console.log('error getting last record', error)
        } else {
            res.send(results)
        }
    })
})

app.get('/show-all', (req, res) => {
    const sql = 'SELECT * FROM simple_users'

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('error getting all data from MySQL database', error)
        } else {
            res.send(results)
        }
    })
})

app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'views', 'sign-up.html'))
})

app.post('/sign-up', (req, res) => {
    const userName = req.body['user-name']
    const userEmail = req.body['user-email']
    const userPassword = req.body['user-password']

    const sql = 'INSERT INTO app_users (user_name, user_password, user_email) values (?, ?, ?)'

    connection.query(sql, [userName, userPassword, userEmail], (error, results) => {
        if (error) {
            console.log('error', error)
            return res.status(500).json({ message: 'Error saving user', error: error.message })
        } else {
            console.log('User saved to the database successfully!', results)
            const token = jwt.sign({id: results.insertId}, JWT_SECRET, {expiresIn: '5min'})
            res.cookie('token', token, {
                httpOnly:true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 300000,
            }).redirect('/')
        }
    })
})

app.get('/teste-rota-middleware', (req, res) => {
    res.redirect('/')
})

app.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logout successful' })
})

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000')
})