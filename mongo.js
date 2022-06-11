const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('usage: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.0wtr9.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
    .then(result => {
        if (process.argv.length === 3) {
            console.log('phonebook:')
            Person.find({}).then(result => {
                result.forEach(person => console.log(`${person.name} ${person.number}`))
                mongoose.connection.close()
            })
        } else if (process.argv.length === 5) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            })

            person.save().then(() => {
                console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
                mongoose.connection.close()
            })
        }
    })