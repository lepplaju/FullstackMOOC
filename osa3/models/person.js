const mongoose = require('mongoose')

const url = process.env.MONGODB_URI // Osoite saadaan muualta (esimerkiksi harokun config vars)
console.log('connecting to: ', url)

mongoose.connect(url).then(
  result => {console.log('connected to MONGODB')
  })
  .catch((error) => {
    console.log('error connecting to mongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({ // Käytetään skeemaa, joka määrittää henkilön tietoihin hyväksytyn sisällön
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: { // Luodaan oma validointi, joka sallii puhelinnumeron yhdellä väliviivalla erotettuna
      validator: function(num){
        return /\d{2,3}-\d{6,10}$/.test(num)}
    }
  }
})


personSchema.set('toJSON', { // Poistetaan/muokataan MongonDB:n sisältämää dataa, käyttäjälle sopivaksi
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person',personSchema)

