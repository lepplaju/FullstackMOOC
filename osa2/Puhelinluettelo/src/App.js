// FullStack-kurssin tehtävät 2.6 - 2.10, 2.15-2.18
// @Lepplaju 21.06.2022

import { useState, useEffect } from 'react'
import PersonHandling from './services/persons'

// Apukomponentti, joka huolehtii suodattimen tekstikentästä
const Filter = (props) => (
	<form>
		<div>filter shown with <input value={props.data} onChange = {props.update}/></div>
	</form>
)

// Huolehtii uuden henkilön lisäämisen listalle
// Tekstikenttien tilat ja tapahtumat haetaan juurikomponentista
const PersonForm = (props) => (
	<form onSubmit={props.handleSubmit}>
    	<div>name: <input value = {props.nameVal} onChange={props.nameFunc}/> </div>
		<div>number:<input value={props.numVal} onChange = {props.numFunc}/></div>
    	<div><button type = "submit">add</button></div>
	</form>
)

// Huolehtii ilmoituksien näyttämisestä. 
// Jos ilmoitus on tyhjäarvo, palautetaan näkymätön alue, jotta myöhemmin ilmoituksen tullessa, muu teksti ei hypi ruudulla.  
const Notification = (props) => {
  if (props.message === null) return (<div className='invisibleBox'> </div>)
  return (<div className={props.customStyle}>{props.message}</div>)
}

// Apukomponentti, joka vertaa suodattimen arvoa henkilöiden nimiin ja luo uuden taulukon osumien perusteella
const Persons = (props) => {
   // Suodatetaan henkilöt niin, että ei oteta huomioon isoja- ja pieniä kirjaimia 
  const filteredData = props.data.filter(person => person.name.toLocaleLowerCase().includes(props.myFilter.toLocaleLowerCase()))
  return (<RenderNames filteredNames ={filteredData} deleteFunc = {props.deleteFunc}/>)
}

// Renderöidään jokainen suodattimesta läpi mennyt henkilö näytölle, poista-painikkeen kanssa
const RenderNames = (props) => (
  props.filteredNames.map(person => 
  <div key ={person.id}>
    <p className='person' key={person.name}>{person.name} : <span className='numbers'>{person.number}</span>
    <button className='personButton' onClick={()=>{props.deleteFunc(person.id,person.name)}}>delete </button></p>
  </div>)
)

// Juurikomponentti, sisältää tila- ja tapahtumankäsittelijäfunktiot
const App = () => {
  	const [persons, setPersons] = useState([]) 
  	const [newName, setNewName] = useState('')
  	const [newNumber, setNewNumber] = useState('')
  	const [newFilter, setFilter] = useState('')
  	const [newMessage, setMessage] = useState(null)
  	const [activeStyle, setStyle] =  useState(null)

  	useEffect(() => {		// Hakee datan palvelimelta ja asettaa henkilöt listaan
    PersonHandling.getAll().then(response => {
      setPersons(response.data)
    })}, [])   

  	// Uuden nimen väliaikainen ylläpitäminen tekstikentässä
  	const handleNameChange = (event) => {
    setNewName(event.target.value)
  	}

  	// Uuden numeron väliaikainen ylläpitäminen tekstikentässä
  	const handleNumberChange = (event) => {
   	const merkit = /^[0-9\-]+$/		// Sallitaan tekstikentän sisällöksi ainoastaan numerot tai väliviiva
    if (event.target.value === '' || merkit.test(event.target.value)) {
      setNewNumber(event.target.value)
      }
  	}
		// Suodattimen arvon ylläpito
		const handleFilter = (event) => {
			setFilter(event.target.value)
		}

		// Uuden henkilön lisääminen tai muokkaaminen
		const handleAddNewPerson = (event) => {
  	event.preventDefault()
  	const personObj = {name: newName, number: newNumber}
  	if(personObj.name.length<1) return(alert('invalid name'))		// Kielletään tyhjä merkkijono


  	if (persons.some(person => person.name === personObj.name)){ 	// Mennään tänne jos listalla on samanniminen henkilö
    const personIndex = persons.findIndex(person => person.name === personObj.name)     // Haetaan samannimisen indeksi (id != index)   
    if(window.confirm("Haluatko korvata aikaisemman numeron uudella numerolla?")){		// Käyttäjä joutuu varmistamaan, että haluaa päivittää henkilölle uuden numeron
      return(PersonHandling.update(persons[personIndex].id, personObj).then(response => {
        const newArr = [...persons]           // Kopioidaan alkuperäisten henkilöiden tiedot uuteen taulukkoon
        newArr[personIndex] = response.data   // Muutetaan uuden taulukon yhtä arvoa
        setPersons(newArr)                    // Asetetaan kopio alkuperäisen tilalle
        
        setStyle('updated')                   // Luodaan käyttäjälle visuaalinen ilmoitus tapahtuneesta
        setMessage(`Updated ${personObj.name}`)
        setTimeout(() => {setMessage(null)}, 5000)
        setNewName('')            // Tekstikenttien tyhjentäminen
        setNewNumber('')
        })
        .catch(error => {         // Visuaalinen virheilmoitus käyttäjälle jos yritetään muokata poistettua henkilöä
          console.log(error)
          setStyle('deleted')
          setMessage(`Information of ${personObj.name} has already been removed from the server`)
          setTimeout(() => {setMessage(null)},5000)
        })         
      )}

    return (alert(`${personObj.name} already exists`)) // Tämä tulee jos yritettiin lisätä samannimistä henkilöä ja vastattiin sen muokkaamiseen ei.
  	}
  
  	// Uuden henkilön tietojen lähettäminen palvelimelle
  	PersonHandling.create(personObj).then(response => {
    	setPersons(persons.concat(response.data))   // Haetaan data palvelimelta eli tämän jälkeen data on synkronoitu
    	setNewName('')
    	setNewNumber('')                            // Tyhjennetään tekstikentät
    	setStyle('added')                           // Visuaalinen ilmoitus käyttäjälle tapahtuneesta
    	setMessage(`Added ${personObj.name}`)
    	setTimeout(() => {setMessage(null)}, 5000)
  	})
		}

  	// Poistaa henkilön listalta, jos ponnahdusikkunaan vastataan myönteisesti 
  	const handleDelete = (id, name) => {
    if(window.confirm(`Haluatko poistaa henkilön ${name} listalta?`)){
      PersonHandling.deletePerson(id)
      setPersons(persons.filter(x=>x.id!==id))  // Sivulta poisto ilman uudelleenrenderöintiä
      setStyle('deleted')                       // Luodaan käyttäjälle visuaalinen ilmoitus tapahtuneesta
      setMessage(`Deleted ${name}`)
      setTimeout(() => {setMessage(null)}, 5000)
      }
  	} 


	// Näytölle renderöinti alkaa tästä
  return (
    <div>
      <h2 className={'title'}>Phonebook</h2>
        <Notification message={newMessage} customStyle ={activeStyle}/>
          <Filter update = {handleFilter} data = {newFilter}/>
      <h2>add a new</h2>
        <PersonForm handleSubmit={handleAddNewPerson} nameVal={newName} nameFunc={handleNameChange} numVal ={newNumber} numFunc ={handleNumberChange} />
      <h2>Numbers</h2>
        <Persons data = {persons} myFilter = {newFilter} deleteFunc = {handleDelete}/>
    </div>
  )
}

export default App