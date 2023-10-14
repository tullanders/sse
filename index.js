const express = require('express')
const app = express();
const router = express.Router();
const sse = require('./sse');
const port = 3000

app.use(express.static('public'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/events/:topic', sse.events);

// create a timer that calls the internalSendEvents function every 5 seconds
setInterval(() => {
  sse.internalSendEvents({message: 'Hello from topic1!'}, 'topic1');
}, 1600);

setInterval(() => {
    sse.internalSendEvents({message: 'Hello from topic2!'}, 'topic2');
  }, 3700);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})