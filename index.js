const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/person')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3001
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content-person'))

app.get('/api/persons',(request,response)=>{
    Person.find({}).then(persons => response.json(persons) )
    
})

app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    Person.findById(id)
        .then(person => {
            person ? response.json(person) : response.status(404).end()    
        })
        .catch(error => {
            console.log(error)
            response.status(500).end()
        })
    
})

app.post('/api/persons',(request,response)=>{
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({
            error: "missing name or number"
        })
    }

    const person = new Person({
        name:body.name,
        number:body.number
    })
    person.save().then(savedPerson => response.json(savedPerson))
        
})

app.delete('/api/persons/:id',(request,response,next)=>{
    Person.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

app.get('/info',(request,response)=>{
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p> ${new Date}</p>
    `)
})

morgan.token('content-person',(req,res)=>{
    return `{"name":"${req.body['name']}","number:"${req.body['number']}"}`
})
const unknownEndpoint = (req,res) =>{
    res.status(404).send({error:"unknown endpoint"})
}
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(unknownEndpoint)
  app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})