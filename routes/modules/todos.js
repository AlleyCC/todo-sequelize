const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

//create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const { name } = req.body
  const UserId = req.user.id
  return Todo.create({ name, UserId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//detail
router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  
  return Todo.findOne({ where: { id, UserId }})
    .then(todo => {
      return res.render('detail', { todo: todo.toJSON() }) //.toJSON(): 將資料轉換成plain object
    })
    .catch(err => console.log(err))
})

//edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId }})
    .then(todo => {
      return res.render('edit', { todo: todo.toJSON() })
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, UserId }})
    .then(todo => {
      name = todo.name
      isDone = todo.isDone
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(err => console.log(err))
})

//delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  return Todo.findOne({ where: { id, UserId } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router