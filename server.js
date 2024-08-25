const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname)))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/submit', (req, res) => {
    let name = req.body.name
    let age = req.body.age
    let gender = req.body.gender

    console.log('dados recebidos:', name, age, gender)
    res.redirect(`/received?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}&gender=${encodeURIComponent(gender)}`)
})

app.get('/received', (req, res) => {
    res.sendFile(path.join(__dirname, 'received.html'))
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
});