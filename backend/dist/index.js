"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let senderSocket = null;
let receiverSocket = null;
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        //identify as sender
        //identify as recever
        //create offer
        // create answer
        // add ice candidate
        if (message.type === "sender") {
            console.log("Sender is now set");
            senderSocket = ws;
        }
        else if (message.type === "receiver") {
            console.log("Receiver is now set");
            receiverSocket = ws;
        }
        else if (message.type === "create-offer") {
            console.log("offer Received");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "create-offer", sdp: message.sdp }));
        }
        else if (message.type === "create-answer") {
            console.log("Answer Received");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "create-answer", sdp: message.sdp }));
        } else if (message.type === 'iceCandidate') {
            if (ws === senderSocket) {
                receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
              } else if (ws === receiverSocket) {
                senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
              }
        }
        //console.log(message);
    });
    //ws.send('something');
});
