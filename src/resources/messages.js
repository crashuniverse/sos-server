const get = async (req, res) => {
  try {
    const {db} = req.app.locals
    const {api_key} = req.query
    const client = await db.collection('clients')
      .findOne({
        api_key,
      })
    if (client) {
      const data = await db.collection('messages')
        .find({
          client: client._id,
        }, {
          projection: {
            client: 0,
          }
        })
        .toArray()
      const response = {
        items: data,
      }
      res.send(response)
    } else {
      throw new Error('No registered client')
    }
  } catch(error) {
    console.error(error)
    res.status(500)
      .send('Internal Server Error')
  }
}

const post = async (req, res) => {
  try {
    const {db} = req.app.locals
    const {api_key} = req.query
    const client = await db.collection('clients')
      .findOne({
        api_key,
      })
    if (client) {
      const {message, event_timestamp} = req.body
      const messageDocument = {
        client: client._id,
        message,
        event_timestamp,
      }
      await db.collection('messages')
        .insertOne(messageDocument)
      res.sendStatus(204)
    } else {
      throw new Error('No registered client')
    }
  } catch(error) {
    console.error(error)
    res.status(500)
      .send('Internal Server Error')
  }
}

module.exports = {
  get,
  post,
}