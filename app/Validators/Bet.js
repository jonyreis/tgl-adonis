'use strict'

class Bet {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      numbers: 'required',
      game_id: 'required',
      user_id: 'required'
    }
  }
}

module.exports = Bet
