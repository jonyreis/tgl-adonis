'use strict'

class Game {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      type: 'required',
      description: 'required',
      price: 'required',
      range: 'required',
      max_number: 'required',
      min_cart_value: 'required',
      color: 'required'
    }
  }
}

module.exports = Game
