//Fullstack-kurssin osan 3 tehtävät
//@Lepplaju 07.07.2022
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person') // Haetaan henkilöiden datan skeema

app.use(express.json())
const requestLogger = (request, response, next) => { // Kaikkiin dataan liittyvien käskyjen printtaus konsoliin
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons/',(request,response) => { // Haetaan kaikkien henkilöiden tiedot
  Person.find({}).then(
    persons => {response.json(persons)
    })
})

app.get('/api/persons/:id/',(request,response, next) => { // Haetaan yksittäisen henkilön tiedot id:n perusteella
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }

  })
    .catch(error => next(error))
})

app.post('/api/persons',(request,response, next) => { // Luodaan uusi henkilö jos validointi menee läpi
  const body = request.body
  console.log(body)
  const person = new Person(
    {
      name: body.name,
      number: body.number,
    })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id/',(request,response, next) => { // Henkilön poisto id:n avulla
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id/',(request,response, next) => { // muokataan henkilöä id:n perusteella
  const { name,number } = request.body
  Person.findByIdAndUpdate(request.params.id,{ name,number },{ new:true, runValidators:true, context:'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/api/info/',(request,response) => { // erillinen info-sivu, joka kertoo henkilöiden määrän ja päivämäärän
  Person.find({}).then(
    persons => {response.json(`Phonebook has info of ${persons.length} People ` + new Date())
    })
})


const unknownEndpoint = (request, response) => { // Tänne mennään, jos haetaan sivua, joka ei ole olemassa
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => { // Virheidenkäsittely
  console.error(error.message)
  console.log(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name ==='ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => (console.log(`server running on port ${PORT}`)))
