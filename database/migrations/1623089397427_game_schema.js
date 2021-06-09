'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GameSchema extends Schema {
  up () {
    this.create('games', (table) => {
      table.increments()
      table.text('type', 80).notNullable().unique()
      table.text('description').notNullable()
      table.integer('range')
      table.integer('max_number')
      table.integer('min_cart_value')
      table.string('color')
      table.float('price')
      table.timestamps()
    })
  }

  down () {
    this.drop('games')
  }
}

module.exports = GameSchema
