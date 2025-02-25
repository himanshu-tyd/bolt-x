import express from 'express'
import { getTemplate } from '../controllers/template.controller'

const router=express.Router()

router.post('/template', getTemplate)

export default  router 