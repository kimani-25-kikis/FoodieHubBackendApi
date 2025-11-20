import { type Context, Hono } from 'hono'
import * as orderItemControllers from './orderItem.controllers.ts'
import { adminRoleAuth } from '../middleware/bearAuth.ts'
// import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from './todo.controller.ts'

const orderItemRoutes = new Hono()



// Get all order items
orderItemRoutes.get('order-items',  orderItemControllers.getAllOrderItems)

//g

// Get order item by ID
orderItemRoutes.get('order-items/:order_item_id',  orderItemControllers.getOrderItemById)

// Create a new order item
orderItemRoutes.post('order-items',  orderItemControllers.createOrderItem)

// Update an order item
orderItemRoutes.put('order-items/:order_item_id',  orderItemControllers.updateOrderItem)

// Delete an order item
orderItemRoutes.delete('order-items/:order_item_id',  orderItemControllers.deleteOrderItem)

export default orderItemRoutes