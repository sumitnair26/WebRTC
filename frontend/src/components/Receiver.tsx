import { useEffect } from "react";

export const Receiver = () => {
    useEffect(()=> {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type:'receiver'
            }))
        }
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            //console.log(event.data);
            let pc: RTCPeerConnection | null = null;
            if (message.type === 'create-offer') {
                pc = new RTCPeerConnection();
                pc.setRemoteDescription(message.sdp);
                pc.onicecandidate = (event) => {
                    console.log(event);
                    if (event.candidate) {
                        socket.send(JSON.stringify({ type:'iceCandidate', candidate: event.candidate }))
                    }
                }
               
                /*
                pc.ontrack = (event) => { 
                    const video = document.createElement('video');
                    video.controls = true;
                    document.body.appendChild(video);       
                    video.srcObject = new MediaStream([event.track]);
                    video.play();   
                } */
                    
                    pc.ontrack = (event) => {
                        const video = document.createElement('video');
                        document.body.appendChild(video);       
                        video.srcObject = new MediaStream([event.track]);
                    
                        // Instead of playing immediately, wait for user interaction
                        const playVideos = () => {
                            video.play().catch(e => console.error('Error playing video:', e));
                        };
                        playVideos();
                        document.removeEventListener('click', playVideos);
                    };
            
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({
                    type:'create-answer',
                    sdp: pc.localDescription
                }));
            } else if (message.type==="iceCandidate") {
                if (pc !==null) {
                    //@ts-ignore
                    pc?.addIceCandidate(message.candidate);   
                }
            }
        }
    },[])
    return <div>
        Receiver 
        {/* <video></video> */}
    </div>
}

