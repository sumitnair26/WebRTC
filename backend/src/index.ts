import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

 let senderSocket: null | WebSocket = null;
 let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: any) {
    const message = JSON.parse(data);
    //identify as sender
    //identify as recever
    //create offer
    // create answer
    // add ice candidate
    if (message.type==="sender") {
        console.log("Sender is now set");
        senderSocket = ws;
    } else if( message.type==="receiver" ) {
        console.log("Receiver is now set");
        receiverSocket = ws;
    } else if(message.type==="create-offer") {
        console.log("offer Received");
        receiverSocket?.send(JSON.stringify({ type:"create-offer", sdp: message.sdp }))
    } else if(message.type === "create-answer") {
        console.log("Answer Received");
        senderSocket?.send(JSON.stringify({ type:"create-answer", sdp: message.sdp }))
    }
    //console.log(message);
  });

  //ws.send('something');
});