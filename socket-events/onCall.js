import { io } from "../server.js"

const onCall =  (participants) => {
    // console.log(participants);
    
    if(participants.receiver.socketId)
    {
        io.to(participants.receiver.socketId).emit('incomingCall', participants);
    }

}

export default onCall;