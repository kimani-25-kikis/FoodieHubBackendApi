import { type Context, Hono } from 'hono'
import * as restaurantControllers from './restaurant.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'
// import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from './todo.controller.ts'

const restaurantRoutes = new Hono()



// Get all restaurants
restaurantRoutes.get('restaurants',  restaurantControllers.getAllRestaurants)

// Get restaurant by ID
restaurantRoutes.get('restaurants/:restaurant_id',  restaurantControllers.getRestaurantById)

// Create a new restaurant
restaurantRoutes.post('restaurants',  restaurantControllers.createRestaurant)

// Update a restaurant
restaurantRoutes.put('restaurants/:restaurant_id', restaurantControllers.updateRestaurant)

// Delete a restaurant
restaurantRoutes.delete('restaurants/:restaurant_id',  restaurantControllers.deleteRestaurant)

export default restaurantRoutes