'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Mail = use('Mail')
const Bet = use('App/Models/Bet')

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

  async index({ response, auth }) {
    try {
      const user = await auth.user

      if (user.id) {
        const filteredBetsForUser = await Bet.query().where({
          'user_id': user.id,
        })
        .orderBy('created_at', 'desc')
        .with('game')
        .fetch()

        return filteredBetsForUser
      } else {
        const bets = await Bet.query().with('game').fetch()
        return bets
      }

    } catch (err) {
      return response.status(400).send({ error: { message: err.message } });
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
      const user = auth.user
      const data = request.only(['list'])

      const newData = data.list.map((item) => {
        return {
          numbers: item.numbers,
          game_id: item['game_id'],
          user_id: user.id
        }
      })

      const bets = await Bet.createMany(newData)

      await Mail.send(
        ['emails.bet'],
        { email: user.email },
        (message) => {
          message
            .to(user.email)
            .from('jonyreiscardoso@gmail.com')
            .subject('Nova Aposta')
        }
      )

      return bets
    } catch (err) {
      console.log(err)
      return response
        .status(500)
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
