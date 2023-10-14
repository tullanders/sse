const express = require('express')
const app = express();
const sse = require('./sse');
const trainAnnouncement = require('./trainannouncement.js');

const port = 3000

app.use(express.static('public'))

// For parsing application/json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// route event stuff to sse.js
app.get('/events/:topic', sse.events);
app.post('/sendevent/:topic', sse.externalSendEvent);
app.get('/subscribers', sse.subscribers);

trainAnnouncement.fetchTrains();

// Test sending events from this app to topic1.
setInterval(() => {
  sse.internalSendEvent({message: 'Hello from topic1!'}, 'topic1');
}, 1600);

// Test sending events from this app to topic2.
setInterval(() => {
    sse.internalSendEvent({message: 'Hello from topic2!'}, 'topic2');
  }, 3700);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})