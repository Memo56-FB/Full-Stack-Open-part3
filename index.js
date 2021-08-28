const express = require('express')
const morgan = require('morgan')

const app = express()
const PORT = 3001

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content-person'))

let persons = [
    {
        id:1,
        name: "Arto Hellas",
        number: "040-123456"    
    },
    {
        id:2,
        name: "Ada Lovelace",
        number: "39-44-5323523"    
    },
    {
        id:3,
        name: "Dan Abramov",
        number: "12-43-234345"    
    },
    {
        id:4,
        name: "Mary Poppendick",
        number: "30-23-6423122"    
    }
]

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = +request.params.id
    const person = persons.find(person => person.id === id)
    person ? response.json(person) : response.status(404).end() 
    
})

app.post('/api/persons',(request,response)=>{
    const id = Math.floor(Math.random()*1000)
    const person = request.body
    if(!person.name || !person.number){
        return response.status(400).json({
            error: "missing name or number"
        })
    }
    if(persons.find(personF => personF.name === person.name)){
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    person.id = id
    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = +request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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
app.use(unknownEndpoint)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})