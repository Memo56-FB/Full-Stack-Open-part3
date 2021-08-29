const mongoose = require('mongoose')

const password = process.argv[2]

const url = `mongodb+srv://MemoFullstack:${password}@cluster0.yqurk.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if(!person.name && !person.number){
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(personResult => {
            console.log(personResult.name,personResult.number)
        })
        mongoose.connection.close()
    })
}else{
    person.save().then(result => {
        console.log(`Added ${result.name} number: ${result.number} to phonebook`)
        // console.log(result)
        mongoose.connection.close()
    })
}
