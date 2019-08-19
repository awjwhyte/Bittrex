const bittrex = require('./bit')
const client = new bittrex()

// client.public('getmarketsummaries')
client.private('getbalances')