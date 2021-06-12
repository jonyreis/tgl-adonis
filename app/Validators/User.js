'use strict'

class User {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users',
      email: 'required|unique:users',
      password: 'required'
    }
  }
}

module.exports = User
