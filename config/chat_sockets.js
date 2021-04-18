module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });


        // For detecting a event. "on"
        socket.on('join_room', function(data){
            console.log('joining request received..', data);

            // When the joining request has been received, I want user to be joined to that particular
            // room. What this will do is, if there is a chatroom, with name data.chatroom
            // whcih is "codeial" already exists. So the user will be connected or entered into 
            // That chatroom
            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user joined', data);
        })

        // CHANGE :: Detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        })
    });

}



