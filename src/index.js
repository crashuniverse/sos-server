const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const messages = require('./resources/messages')

dotenv.config()
const app = express()
app.use(bodyParser.json())
const {PORT: port} = process.env

const connect = async () => {
  try {
    const {DB_USER: user, DB_PASSWORD: password, DB_NAME: db_name} = process.env
    const connectionUri = `mongodb+srv://${user}:${password}@cluster0-kthfx.mongodb.net/test?retryWrites=true`
    const mongoClient= new MongoClient(connectionUri, {useNewUrlParser: true})
    await mongoClient.connect()
    app.locals.db = mongoClient.db(db_name)
  } catch(error) {
    console.error(error)
  }
}
connect()

app.get('/', (req, res) => res.json({status: true}))
app.get('/messages', messages.get)
app.post('/messages', messages.post)

app.listen(port, () => console.log(`App listening on port ${port}!`))
