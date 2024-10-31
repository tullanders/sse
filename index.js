const uuid = require('uuid');
class SseServer {
    #clients = [];
    constructor() {
        this.events = this.events.bind(this);

    }
    internalSendEvent(data, topic) {
        if (this.#clients.length == 0)
            return;
        const selectedClients = this.#clients.filter(sub => sub.topic == topic);
        if (selectedClients.length == 0)
            return;
        selectedClients.forEach(s => s.response.write(`data: ${JSON.stringify(data)}\n\n`));
    }
    externalSendEvent(request, response) {
        const data = request.body;
        const topic = request.params.topic;
        try {
            this.internalSendEvent(data, topic);
            response.send({ 'status': 'ok', 'data': data, 'topic': topic });
        }
        catch (err) {
            response.send({ 'status': 'error', 'error': err });
        }
    }   

    // creates a SSE-endpoint for clients to subscribe to events
    events(request, response) {
        let topic = request.params.topic;
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        const client = {
            id: uuid.v4(),
            topic: topic,
            response
        };

        this.#clients.push(client);
        response.writeHead(200, headers);
        request.on('close', () => {
            this.#clients = this.#clients.filter(sub => sub.id !== client.id);
        });
    }
};
module.exports = {
    SseServer
};