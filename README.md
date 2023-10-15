# node.js SSE-server
This is a simple SSE-server in node.js. The server can handle subscribers to multiple topics/categories.

## Send events to client from your code
To use the server in your code:
```
// include the file:
const sse = require('./sse');

// example, sending events to topic "topic1" every second:
setInterval(() => {
  sse.internalSendEvent({message: 'Hello from topic1!'}, 'topic1');
}, 1000);
```
Sending events require two params:
* data (JSON object)
* topic (string). This creates a subscribable endpoint to the client (/events/:topic)

You can also create an endpoint for posting events from an external source:
```
app.post('/sendevent/:topic', sse.externalSendEvent);
```

## Usage example (client)
```
var sse = new EventSource('/events/topic1');
sse.onmessage = function(e) {
    console.log(JSON.parse(e.data));
};
```
### Notice
I made this just for fun. To use it in production enviroment you should refactor the code, add CORS-policys, logging, error handeling etc.