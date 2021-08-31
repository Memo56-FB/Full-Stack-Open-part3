const express = require("express")
const morgan = require("morgan")
const Person = require("./modules/person")
const errorHandler = require("./errorHandler")

require("dotenv").config()
const app = express()
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.use(express.json())
app.use(express.static("build"))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content-person"))

app.get("/api/persons",(_request,response) => {
	Person.find({}).then(persons => response.json(persons) )
})

app.get("/api/persons/:id",(request,response,next) => {
	const id = request.params.id
	Person.findById(id)
		.then(person => {
			person ? response.json(person) : response.status(404).end()
		})
		.catch(error => {
			next(error)
		})
})

app.post("/api/persons",(request,response,next) => {
	const body = request.body

	const person = new Person({
		name:body.name,
		number:body.number
	})
	person.save()
		.then(savedPerson => response.json(savedPerson.toJSON()))
		.catch(error => next(error))
})

app.delete("/api/persons/:id",(request,response,next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => response.status(204).end())
		.catch(error => next(error))
})
app.put("/api/persons/:id",(req,res,next) => {
	const body = req.body
	const person = {
		name: body.name,
		number:body.number
	}
	Person.findByIdAndUpdate(req.params.id, person, { new:true })
		.then(updatedPerson => res.json(updatedPerson))
		.catch(error => next(error))
})

app.get("/info",(_request,response) => {
	Person.find({}).then(persons => {
		response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p> ${new Date}</p>
        `)
	})
})

morgan.token("content-person",(req) => {
	return `{"name":"${req.body["name"]}","number:"${req.body["number"]}"}`
})
const unknownEndpoint = (_req,res) => {
	res.status(404).send({ error:"unknown endpoint" })
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})