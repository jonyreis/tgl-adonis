'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Bet = use('App/Models/Bet')
const Mail = use('Mail')

/**
 * Resourceful controller for interacting with bets
 */
class BetController {
  /**
   * Show a list of all bets.
   * GET bets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    try {
      const bets = await Bet.query().with('game').fetch()
  
      return bets
    } catch (err) {
      return response
        .status(400)
        .send({ error: { message: err.message } })
    }
  }

  /**
   * Create/save a new bet.
   * POST bets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const data = request.only(['numbers', 'game_id', 'user_id'])

      const bets = await Bet.create(data)

      await bets.load('user')
      await bets.load('game')
      await bets.save()

      await Mail.send(
        ['emails.bet'],
        {
          numbers: data.numbers,
        },
        message => {
          message
            .to(auth.user.email)
            .from('jonyreiscardoso@gmail.com', 'Jony Reis')
            .subject('Nova Aposta')
        }
      )

      return bets
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo não deu certo, ao fazer uma nova aposta'} })
    }
  }

  /**
   * Display a single bet.
   * GET bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const bets = await Bet.findOrFail(params.id)

    return bets
  }

  /**
   * Update bet details.
   * PUT or PATCH bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const bet = await Bet.findOrFail(params.id)
    const data = request.only(['numbers'])

    bet.merge(data)

    await bet.save()
    return bet
  }

  /**
   * Delete a bet with id.
   * DELETE bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const bet = await Bet.findOrFail(params.id)

    await bet.delete()
  }
}

module.exports = BetController
