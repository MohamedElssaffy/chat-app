const generateMesssage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, locationURL) => {
    return {
        username,
        locationURL,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMesssage,
    generateLocationMessage
}