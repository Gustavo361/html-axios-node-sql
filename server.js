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

    console.log('Tentativa de login com:', userName, userPassword);

    const sql = `SELECT * FROM app_users WHERE user_name = ? AND user_password = ?`

    connection.query(sql, [userName, userPassword], (error, results) => {
        if (error) {
            console.log('erro ao pra achar o usuario no login')
            res.status(500).send('erro interno do servidor')
        } else {
            if (results.length > 0) {
                console.log('usuario e senhas encontrados no banco e passou pra home')
                res.sendFile(path.join(__dirname, 'index.html'))
            } else {
                console.log('erro: usuario ou senha incorretos ou nao encontrados')
                res.status(401).send('usuário ou senha incorretos')
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