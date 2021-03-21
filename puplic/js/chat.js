const socket = io()

// elements for send Message
const $messageForm = document.querySelector('#sendMessage')
const $messageFormInput = $messageForm.querySelector('input[name="message"]')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

// elements for send location
const $sendLocationButton = document.querySelector('#send-location')

// Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTempate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// room 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// auto scroll function
const autoscroll = () => {

    // new message element
    const $newMessage = $messages.lastElementChild

    // total height of new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible Height 
    const visibleHeight = $messages.offsetHeight

    //total height
    const containerHeight = $messages.scrollHeight

    // how far i scroll
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
    
}



socket.on('message', (message) =>{

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a') 
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message //document.querySelector('#sendMessage input[type="text"]')

    message.focus()
    if(!message.value) {
        message.setAttribute('placeholder', 'Please Write Your Message')
        $messageFormButton.removeAttribute('disabled')
    } else {
        socket.emit('sendMessage', message.value, (error) => {
            $messageFormButton.removeAttribute('disabled')
            
            if (error) {
                return console.log(error)
            }
            console.log('Message Delivered!')
        })

        message.value = ''
    }
})

$sendLocationButton.addEventListener('click', () =>{

    if (!navigator.geolocation) {
        return alert('Your Browser Not Supported Geo Location')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }
        socket.emit('sendLocation', location, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})

socket.on('locationMessage', ({username, locationURL, createdAt}) => {
    console.log(locationURL)
    const html = Mustache.render(locationTempate, { username, locationURL, createdAt: moment(createdAt).format('hh:mm a') })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})