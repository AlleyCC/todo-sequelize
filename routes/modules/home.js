const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

//home  
//{raw: true, nest: true}: 傳入參數將資料轉換成plain object並排除不需要的資料
router.get('/', (req, res) => {
  return User.findByPk(req.user.id)
    .then(user => {
      if (!user) throw new Error('User not found!')
      
      return Todo.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
    })
    .then(todos => res.render('index', { todos }))
    .catch(err => console.log(err))
})

module.exports = router