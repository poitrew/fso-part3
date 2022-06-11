require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

/* middleware */

app.use(express.json())
app.use(express.static('build'))

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/* CREATE */

app.post('/api/persons', (req, res) => {
    const person = new Person(req.body)
    
    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'content missing',
        })
    }

    return person.save().then(result => res.json(result))
})

/* READ */

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})
    
app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id) 

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

/* DELETE */

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id) 
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})