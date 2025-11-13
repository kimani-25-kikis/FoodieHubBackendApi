import {Hono} from 'hono'
import * as authControllers from './auth.controllers.ts'

const authRoutes = new Hono()

// define auth routes i.e register, login


// Register new user
authRoutes.post('/auth/register', authControllers.createUser)

// Login user
authRoutes.post('/auth/login', authControllers.loginUser )





export default authRoutes