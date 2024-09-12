import  { Router } from 'express'
import Example from '../Controllers/ExampleController'

const router = Router()

router.get('/', Example.ExampleRoute);

export default router;