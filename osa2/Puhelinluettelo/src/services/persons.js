// Kaikki palvelimella tapahtuva on tässä moduulissa

import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {      // Hakee datan palvelimelta
    return axios.get(baseUrl)
}

const create = (newPerson) => {     // Lähettää dataa
    return axios.post(baseUrl, newPerson)
}

const deletePerson = (id) => {      // poistaa dataa (palvelimen ylläpitämän id:n perusteella)
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newPerson) => { // Päivittää olemassa olevaa dataa (palvelimen ylläpitämän id:n perusteella)
return (axios.put((`${baseUrl}/${id}`),newPerson))
}

export default {getAll, create, deletePerson,update}