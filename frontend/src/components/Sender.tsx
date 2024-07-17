import { useEffect, useState } from "react"

export const Sender = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080");
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type:'sender'
            }))
        }
        setSocket(socket)
    },[]);

    async function startSendingVideo() {
        if (!socket) {
            console.log("socket returned");
            return;
        }
        //create an offer
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            console.log("onnegotiationneeded");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            // trickle ice
            socket?.send(JSON.stringify({
                type: 'create-offer', 
                sdp: pc.localDescription}
            ));
        }
      

        pc.onicecandidate = (event) => {
            console.log(event);
            if (event.candidate) {
                socket.send(JSON.stringify({ type:'iceCandidate', candidate: event.candidate }))
            }
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if(data.type === "create-answer") {
                pc.setRemoteDescription(data.sdp);
            } else if (data.type === "iceCandidate") {
                pc.addIceCandidate(data.candidate)
            }
        }

        /*
        const stream = navigator.mediaDevices.getUserMedia({video: true, audio: false});
    
        pc.addTrack((await stream).getVideoTracks()[0]);
        const video = document.createElement('video');
        document.body.appendChild(video);
        //@ts-ignore
        video.srcObject=stream;
       
        video.play();  */
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        
                // Assuming pc is a previously created RTCPeerConnection
                pc.addTrack(stream.getVideoTracks()[0]);
        
                const video = document.createElement('video');
                document.body.appendChild(video);
                
                video.srcObject = stream;
                video.play();
            } catch (err) {
                console.error('Error accessing media devices.', err);
            }
        })(); 
    }
    return <div>
        <p>
            Sender
        </p>
        <p>
            <button onClick={startSendingVideo} >Send Video</button>
        </p>
    </div>
}