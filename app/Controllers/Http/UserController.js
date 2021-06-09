'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')

class UserController {
  async index () {
    const users = await User.all()

    return users
  }

  async store ({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password'])
      const user = await User.create(data)
  
      await user.save()
  
      await Mail.send(
        ['emails.user'],
        {
          email: data.email,
        },
        message => {
          message
            .to(user.email)
            .from('jonyreiscardoso@gmail.com', 'Jony Reis')
            .subject('Novo Usuário')
        }
      )

      return user
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo não deu certo, ao fazer o cadastro'} })
    }
  }
}

module.exports = UserController
