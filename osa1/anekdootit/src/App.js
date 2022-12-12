/* Fullstack-kurssin tehtävät 1.12 - 1.14 */

import { useState} from 'react'

/* Painike-komponentti */
const Button = (props) => (
  <button onClick={props.handleClick}> {props.text} </button>
)

/* Juurikomponentti */
const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  /* Luodaan taulukko anekdoottien äänestämistä varten */
  /* Ylläpidettään taulukoiden arvoja useStaten avulla: */
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  /* Pidetään tallessa votes-taulukon suurinta arvoa, eli eniten ääniä saanutta anekdoottia */
  const max = Math.max(...votes)

  /* Luodaan satunnainen numero */
  const randomNum = () => {
  setSelected(Math.floor(Math.random()*anecdotes.length))
}

/* Kopioidaan votes-taulukko ja kasvatetaan uuden taulukon arvoa valitun indeksin kohdalta.
  Sen jälkeen asetetaan muokattu taulukko vanhan taulukon tilalle */
const addVote = () => {
  const copy = [...votes]
  copy[selected] +=1
  setVotes(copy)
}

  return (
    <div>
      <h1>Anecdote of the day:</h1>
      <p>{anecdotes[selected]}</p>
      <p>This anecdote has: {votes[selected]} votes</p>
      <div>
        <Button handleClick={addVote} text='Give vote ' />
        <Button handleClick={randomNum}text='Next anecdote'/>
        </div>
        <h1>Anecdote with the most votes:</h1>
        <p>{anecdotes[votes.indexOf(max)]}</p>
        <p>Has {max} votes</p>
    </div>
    
  )
}

export default App
