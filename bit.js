const axios = require('axios')
const crypto = require('crypto')
require('dotenv').config()

const methods = {
    public: ['getmarkets', 'getcurrencies', 'getmarketsummary', 'getmarketsummaries', 'getorderbook', 'getmarkethistory'],
    market: ['buylimit', 'selllimit', 'cancel', 'getopenorders'],
    account: ['getbalances', 'getbalance', 'getdepositaddress', 'withdraw', 'getorder', 'getorderhistory', 'getwithdrawalhistory', 'getdeposithistory']
}

const serialize = (obj)=> {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&")
  }

  class Bittrex {
      constructor() {
        this.API_KEY = process.env.API_KEY
        this.API_SECRET = process.env.API_SECRET
        this.URL = process.env.URL
        this.nonce = new Date().getTime()* 10000
      }


      async public(endpoint, params) {
        if (methods.public.includes(endpoint)) {
            let url =  `${this.URL}public/${endpoint}?${serialize(params)}`
              try {
                let response = await axios.get(url)
                console.log(response.data.result)
              } catch (e) {
                console.log(e)
              }
          } else {
            console.log(`\n${endpoint} is not a valid public endpoint`)
          }
      }

      async private(endpoint, params) {

        const paths = methods.market.includes(endpoint) ? 'market' : 'account'
        const message = `${this.URL}${paths}/${endpoint}?${serialize(params)}&apikey=${this.API_KEY}&nonce=${this.nonce}`
        const sign = crypto.createHmac('sha512', this.API_SECRET).update(message).digest('hex')

        if (methods.market.includes(endpoint) || methods.account.includes(endpoint)) {

            try {
              let response = await axios.get(message, {
                headers: {
                  'APISIGN': sign,
                  'User-Agent': 'Node JS Client',
                  'Content-type': 'application/json'
                }
              })
              console.log(response.data.result)
            } catch (error) {
              console.log(error)
            }
          } else {
            console.log(`\n${endpoint} is not a valid account management endpoint`)
          }
        }
  }

  module.exports = Bittrex 