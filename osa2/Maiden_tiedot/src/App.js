// FullStack kurssin tehtävät 2.11 - 2.13
// @Lepplaju 21.06.2022
import { useState, useEffect } from 'react'
import axios from 'axios'

// Apukomponentti, joka huolehtii maiden renderöinnistä näytölle
// Ei näytä maita ennen kuin suodattimen arvolla on maksimissaan 10 maata
// Näyttää enemmän tietoja jos suodattimella löytyy vain yksi maa
const ShowCountries = (props) => {
if (props.data.length === 0) return <p>No matches with this filter</p>
if (props.data.length === 1) return <ShowAllData data = {props.data[0]}/>
if (props.data.length<11) return (props.data.map(country => <li key={country.cca3}>{country.name.common}</li>))

return <p>This filter has too many matches, type a more specific filter</p> 
}

// Yksittäisen maan perustietojen tulostus
// Tänne mennään kun suodatimessa on vain yksi osuma
const ShowAllData = (props) => (
    <div>
	    <h2>{props.data.name.common}</h2>
    	<p><b>Capital: </b>{props.data.capital}</p>
    	<p><b>Area: </b>{props.data.area}</p>
    	<p><b>Languages:</b></p>
    	<Languages data = {props.data.languages}/> 
    	<RenderFlag data = {props.data.flags}/>          
    </div>
)
 
// Tulostaa kaikki yksittäisessä maassa puhutut kielet
// Object.values palauttaa objektin datan, ilman avaimien arvoa. (Object.keys palauttaisi avaimet)
const Languages = (props) => {
    const values = Object.values(props.data)
	return(values.map(x => <li key={x}> {x} </li>))
}

// Hakee datan sisältämästä url-osoitteesta maan lipun ja renderöi sen näytölle
const RenderFlag = (props) => (<img src={props.data.png} />)


// Juurikomponentti, jossa säilytetään tila- ja tapahtumankäsittelijät
const App = () => {
	const [myCountries, setCountries] = useState([])	// Luodaan taulukko maita varten
	const [myFilter, setFilter] = useState('')
	// Suodatetaan maat ilman että isoilla- ja pienillä kirjaimilla on merkitystä
	const filteredCountries = myCountries.filter(country => country.name.common.toLocaleLowerCase().includes(myFilter.toLocaleLowerCase())) 

	// Haetaan data taulukkoon palvelimelta
	useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
	 	.then(Response => {setCountries(Response.data)})
	},[])

	// Pitää yllä suodattimen arvoa 
	const handleFilter = (event) => {
    setFilter(event.target.value)
	}

return(    
<div>
   <form>
      <div>
      Find countries: <input value={myFilter}
      onChange={handleFilter}></input>
      </div>
   </form>
   <h2>Countries:</h2>
   	<ShowCountries data ={filteredCountries}/>
</div>
	)
}

export default App;
