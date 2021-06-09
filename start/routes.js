'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('register', 'UserController.index')
Route.post('register', 'UserController.store')

Route.post('sessions', 'SessionController.store')

Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

Route.group(() => {
  Route.resource('games', 'GameController').apiOnly()
  
  Route.get('game/bets', 'BetController.index')
  Route.post('game/bets', 'BetController.store')
  Route.put('game/bets/:id', 'BetController.update')
  Route.delete('game/bets/:id', 'BetController.destroy')
}).middleware(['auth'])


