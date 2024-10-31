const express = require('express')
const app = express();
const {SseServer} = require('./index');
const sse = new SseServer();
console.log(sse);
const port = 3000

app.use(express.static('public'))

// For parsing application/json
app.use(express.json());

app.use(express.static('public'))
app.get('/events/:topic', sse.events);
app.post('/sendevent/:topic', sse.externalSendEvent);
app.get('/', (req, res) => {
    res.text('Hello World');
});
// route event stuff to sse.js

//app.get('/subscribers', sse.subscribers);


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