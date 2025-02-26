import express from 'express'
import { getTemplate } from '../controllers/template.controller'
import { chat } from '../controllers/chat.controller'

const router=express.Router()

router.post('/template', getTemplate)
router.post('/chat' , chat)

export default  router 