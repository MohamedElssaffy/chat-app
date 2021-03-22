const users = []

let avaliableRoom = []

const addUser = ({ id, username, room }) => {

    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return { error: 'username and room are required' }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return { error: 'Username is already taken in this room' }
    }

    const user = {
        id,
        username,
        room
    }

    const roomname = { room }
    const repeatedRoom = avaliableRoom.find((roomname) => roomname.room === room)
    if (!repeatedRoom) {
        avaliableRoom.push(roomname)
    }

    users.push(user)

    return { user, roomname }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        const room = users[index].room
        const user = users.splice(index, 1)[0]
        const existedRoom = getUsersInRoom(room)
        if (existedRoom.length ===0) {
            avaliableRoom = avaliableRoom.filter((roomname) => roomname.room !== room)   
        }
        return user
    }
}
const getUser = (id) => {
    const user = users.find((user) => user.id === id )
    return user
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => user.room === room)
    if (usersInRoom) {
        return usersInRoom
    }
}

const getRoomsName = () => {
    if (avaliableRoom.length === 0) {
        return roomname = null
    }
    return avaliableRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRoomsName
}




