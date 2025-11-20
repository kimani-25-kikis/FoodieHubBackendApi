import {Hono} from 'hono'
import * as dataControllers from './dashboard_data.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'

const dataRoutes = new Hono()

// Get admin data
dataRoutes.get('/admin-dashboard', dataControllers.getAdminData)

// Get user data by user_id
dataRoutes.get('/dashboard/:user_id', dataControllers.getUserDataById)

export default dataRoutes