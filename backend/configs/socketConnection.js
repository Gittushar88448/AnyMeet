const {Server} = require('socket.io');

const connectToSocket = (server) => {
    let connections = {};
    let messages = {};
    let timeOnline = {};

    const io = new Server(server, {
        cors: {
            allowedHeaders: ['*'],
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    
    // every time when user connects
    io.on('connection', (socket) => {
        socket.on('join-call', (path) => {
            if(connections[path] === undefined){
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // inform everyone in the call about the new user
            for(let i = 0; i < connections[path].length; i++){
                io.to(connections[path][i]).emit('user-joined', socket.id, connections[path]);
            }
            if(messages[path] !== undefined){
                for(let a = 0; a < messages[path].length; a++){
                    io.to(socket.id).emit('chat-message', messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender']);
                }
            }
        });

        socket.on('signal', (toId, message) => {
            io.to(toId).emit('signal', socket.id, message);
        });

        socket.on('chat-message', (data, sender) => {
            const [matchingRoom , found] = Object.entries(connections).reduce(([room , isFound], [roomKey, roomValue]) => {
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true];
                }
                return [room , isFound];
            }, ["", false]);
            if(found == true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({'sender': sender, 'data': data, 'socket-id-sender': socket.id});
            }
            connections[matchingRoom]?.forEach(element => {
                io.to(element).emit('chat-message', data, sender, socket.id);
            });
            
        })

        socket.on('disconnect', () => {
            var diff = Math.abs(timeOnline[socket.id] - new Date());

            let key;

            for(let [k , v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
                
                for(let a = 0; a < v.length; a++){
                    if(v[a] === socket.id){
                        key = k;
                    }

                    for(let b = 0; b < connections[key]?.length; b++){
                        io.to(connections[key][b]).emit('user-left', socket.id);
                    }

                    let index = connections[key]?.indexOf(socket.id);
                    
                    connections[key]?.splice(index,1);
                        
                    if(connections[key]?.length === 0){
                        delete connections[key];
                    }
                }
            }
        })
    })
}
module.exports = connectToSocket;