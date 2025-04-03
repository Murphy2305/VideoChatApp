import { io } from "../server.js"

const onHangup =  (data) => {

    let ScoketIdToEmitTo;

    if(data.ongoingCall.participants.caller.userId === data.userHangingupId)
    {
        ScoketIdToEmitTo = data.ongoingCall.participants.receiver.socketId;
    }
    else
    {
        ScoketIdToEmitTo = data.ongoingCall.participants.caller.socketId;
    }
    if(ScoketIdToEmitTo)
    {
        io.to(ScoketIdToEmitTo).emit('hangup')
    }
    

}

export default onHangup;