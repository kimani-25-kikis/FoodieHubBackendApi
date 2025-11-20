import { type Context, Hono } from 'hono'
import * as categoryControllers from './categories.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'
// import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from './todo.controller.ts'

const categoryRoutes = new Hono()



// Get all categories
categoryRoutes.get('categories',  categoryControllers.getAllCategories)

// Get category by ID
categoryRoutes.get('categories/:category_id',  categoryControllers.getCategoryById)

// Create a new category
categoryRoutes.post('categories',  categoryControllers.createCategory)

// Update a category
categoryRoutes.put('categories/:category_id',  categoryControllers.updateCategory)

// Delete a category
categoryRoutes.delete('categories/:category_id',  categoryControllers.deleteCategory)

export default categoryRoutes