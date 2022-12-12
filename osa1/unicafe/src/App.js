/* Fullstack-kurssin osan 1.0 - 1.11 tehtävät */

import { useState } from "react"

/* Luodaan painike-komponentti */
const Button = (props) =>(
  <button onClick = {props.handleClick}> {props.text} </button>
)

/* Komponentti, joka palauttaa tilastot rivi kerrallaan, siististi erillään toisistaan. */
const StatisticsLine = (props) =>{
  return(
    <tr>
      <td>{props.text}: </td> 
      <td>{props.value}{props.additional}</td>
    </tr>
  )
}

/* "Gatekeeper" - Estää tilastojen tulostuksen, jos niitä ei ole vielä kerätty */
/* Täällä myös tehdään tarvittavat laskutoimitusket keskiarvoja varten */
const Statistics = (props) =>{
if (props.all_values === 0) return ('No statistics gathered yet!')
return (
  <table>
    <tbody>
    <StatisticsLine text='Good'     value={props.good_value}/>
    <StatisticsLine text='Neutral'  value={props.neutral_value}/>
    <StatisticsLine text='Bad'      value={props.bad_value}/>
    <StatisticsLine text='All'      value={props.all_values}/>
    <StatisticsLine text='Average'  value={props.average_value / props.all_values}/>
    <StatisticsLine text='Positive' value= {props.good_value / props.all_values *100} additional='%'/>
    </tbody>
  </table>
  )
}

/* Juurikomponentti / pääohjelma */
const App = () => {
/* Alustetaan tarvittavien muuttujien arvot tilastointia varten */
  const [good_value, setGood] = useState(0)
  const [neutral_value, setNeutral] = useState(0)
  const [bad_value, setBad] = useState(0)
  const [all_values, setAll] = useState(0)
  const [average_value, setAvg] = useState(0)

  /* Painikkeen käsittelijä */ 
  const handleGood = () => {
    setGood(good_value+1)
    setAll(all_values+1)
    setAvg(average_value+1)
  }

  /* Painikkeen käsittelijä */
  const handleNeutral = () => {
    setNeutral(neutral_value+1)
    setAll(all_values+1)
  }

  /* Painikkeen käsittelijä */
  const handleBad = () => {
    setBad(bad_value+1)
    setAll(all_values+1)
    setAvg(average_value-1)
  }

  /* Tästä alkaa rennderöinti */
  return (
  <div>
    <h1>Give feedback!</h1>
    <div>
    <Button handleClick = {handleGood}    text='good'/>
    <Button handleClick = {handleNeutral} text='neutral'/>
    <Button handleClick = {handleBad}     text='bad'/>
    </div>
    <h1>Statistics:</h1>
    <Statistics all_values ={all_values} good_value={good_value} neutral_value={neutral_value} bad_value={bad_value} average_value={average_value}/>
  </div>
    )
  }

export default App