import {Hono} from 'hono'
import * as userControllers from './users.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'


const userRoutes = new Hono()



// Get all users
userRoutes.get('/users', userControllers.getAllUsers)

// Get user by user_id
userRoutes.get('/users/:user_id', userControllers.getUserById)

// // Create a new user
// userRoutes.post('/users', userControllers.createUser)

// Update user by user_id
userRoutes.put('/users/:user_id', userControllers.updateUser)

// Delete user by user_id
userRoutes.delete('/users/:user_id', userControllers.deleteUser)



export default userRoutes