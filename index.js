const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
connectToMongo();
const app = express()
const port = 3000
app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!');
})
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
app.listen(port, () => {
  console.log(`Notetaking app listening on port ${port}`)
})