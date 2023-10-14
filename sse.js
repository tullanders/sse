//npconst cors = require('cors');
const uuid = require('uuid');

// List of subscribers.
let subscribers = [];

// Internal function for sending events to subscribers.
module.exports.internalSendEvent = (data, topic) => {
  if (subscribers.length == 0) return;
  selectedSubscribers = subscribers.filter(sub => sub.topic == topic);
  
  if (selectedSubscribers.length == 0) return;
  selectedSubscribers.forEach(s => s.response.write(`data: ${JSON.stringify(data)}\n\n`));
};

// Endpoint for sending events from external sources. 
// Uses the internalSendEvent function.
module.exports.externalSendEvent = (request, response) => {
  const data = request.body;
  const topic = request.params.topic;
  try {
    module.exports.internalSendEvent(data, topic); 
    response.send({'status': 'ok', 'data': data, 'topic': topic});
  }
  catch (err) {
    response.send({'status': 'error', 'error': err});
  };
  
};

// Endpoint for subscribing to events.
module.exports.events = (request, response, next) => {
  let topic = request.params.topic;
  const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
   };

  const subscriber = {
    id: uuid.v4(),
    topic: topic,
    response
  };
  subscribers.push(subscriber);

  response.writeHead(200, headers);
  
  request.on('close', () => {
    subscribers = subscribers.filter(sub => sub.id !== subscriber.id);
  });
};

// Enndpoint for listing all subscribers.
module.exports.subscribers = (request, response, next) => {
  response.send(subscribers.map(sub => {sub.id, sub.topic}));
}
