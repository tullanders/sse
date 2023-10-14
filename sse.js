//npconst cors = require('cors');
const uuid = require('uuid');


let subscribers = [];
module.exports.sendEvents = (request, response, next) => {
  const data = request.body;
  subscribers.forEach(subscriber => subscriber.response.write(`data: ${JSON.stringify(data)}\n\n`));

  response.json({success: true});
};

exports.internalSendEvents = (data, topic) => {
  selectedSubscribers = subscribers.filter(sub => sub.topic === topic);
  console.log(subscribers.length, selectedSubscribers.length)
  subscribers.forEach(s => s.response.write(`data: ${JSON.stringify(data)}\n\n`));
}

module.exports.events = (request, response, next) => {
  let topic = request.query.topic;
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
  
  request.on('close', () => {
    console.log(`${subscriber.id} Connection closed`);
    subscribers = subscribers.filter(sub => sub.id !== subscriber.id);
  });
};
