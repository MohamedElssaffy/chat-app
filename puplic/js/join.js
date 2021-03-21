socket = io()

// elments
const $select = document.querySelector('#avaliableRoom')
const $form = document.querySelector('form')



// template
const roomTemplate = document.querySelector('#avaliable-room').innerHTML
const roomsTamplate = document.querySelector('#avaliable-rooms').innerHTML


socket.on('avaliableRooms', (roomsname) => {
    if(roomsname !== null) {
        $select.removeAttribute('hidden')
        const html = Mustache.render(roomsTamplate, { roomsname })
        $select.innerHTML = html
    }
})

socket.on('avaliableRoom', (roomname) => {
    if (roomname !== null) {
    const repeated = $select.querySelectorAll('option')
    const exsited = []
    if (repeated.length > 0) {
        
        for (i=0; i < repeated.length; i++) {
            if (repeated[i].innerText === roomname) {
                exsited.push(repeated[i].innerText)
            }
        }
    }
    if (exsited.length > 0) {
        return console.log('room name is already taken')
    }
    $select.removeAttribute('hidden')
    const html = Mustache.render(roomTemplate, { roomname })
    $select.insertAdjacentHTML('beforeend', html)
    }
})