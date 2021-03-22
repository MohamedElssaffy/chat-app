const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMesssage, generateLocationMessage } = require('./utils/messages')
const { getUser, addUser, removeUser, getUsersInRoom, getRoomsName } = require('./utils/users')



const port = process.env.PORT


const app = express()
const server = http.createServer(app)
const io = socketio(server)

// path for html 
const puplicDirctorPath = path.join(__dirname, '../puplic')

app.use(express.json())
app.use(express.static(puplicDirctorPath))

app.get('', async (req, res) => {
    res.send()
})



io.on('connection', (socket) => {
    const roomsname = getRoomsName()
    socket.emit('avaliableRooms', roomsname)

    socket.on('join', (option, callback) => {

        const { user, error } = addUser({id:socket.id, ...option})

        if (error) {
           return callback(error)
        }

        socket.join(user.room)

        io.emit('avaliableRoom', user.room)

        socket.emit('message', generateMesssage('Admin', 'Hello In Our WebSite'))
        socket.broadcast.to(user.room).emit('message', generateMesssage( 'Admin', `${user.username} is joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profane is not allow to send')
        }

        io.to(user.room).emit('message', generateMesssage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {

        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        const avaliableRoom = getRoomsName()
        if (user) {
            io.emit('avaliableRooms', avaliableRoom)
            io.to(user.room).emit('message', generateMesssage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })

})

server.listen(port, () => {
    console.log(`Hello From Server On Port ${port}`)
})