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

app.post('/api/persons', (req, res, next) => {
	const person = new Person(req.body)

	if (!person.name || !person.number) {
		return res.status(400).json({
			error: 'content missing',
		})
	}

	person.save()
		.then(result => res.json(result))
		.catch(err => next(err))
})

/* READ */

app.get('/info', (req, res) => {
	Person.find({}).then(result => {
		res.send(`<p>Phonebook has info for ${result.length} people</p><p>${new Date()}</p>`)
	})
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(result => {
		res.json(result)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id).then(person => {
		if(person) {
			res.json(person)
		} else {
			res.status(404).end()
		}
	}).catch(err => next(err))
})

/* UPDATE */

app.put('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			res.json(updatedPerson)
		}).catch(err => next(err))
})

/* DELETE */

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id).then(() => {
		res.status(204).end()
	}).catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {
	console.log(err)
	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformed id' })
	}
	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}

	next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server is running on port: ${PORT}`)
})