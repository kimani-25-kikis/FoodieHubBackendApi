import { type Context, Hono } from 'hono'
import * as ordersControllers from './orders.controller.ts'
// import { adminRoleAuth } from 'src/middleware/bearAuth.js'
// import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from './todo.controller.ts'

const ordersRoutes = new Hono()



// Get all orders
ordersRoutes.get('orders',  ordersControllers.getAllOrders)

// Get all orders by customer_id
ordersRoutes.get('orders/customer/:customer_id',  ordersControllers.getAllOrdersByCustomerId)

// Get order by ID
ordersRoutes.get('orders/:order_id',  ordersControllers.getOrderById)

// Create a new order
ordersRoutes.post('orders',  ordersControllers.createOrder)

// Update an order
ordersRoutes.put('orders/:order_id',  ordersControllers.updateOrder)

// Update an Order Status 
ordersRoutes.patch('orders/:order_id', ordersControllers.updateOrderStatus)

// Delete an order
ordersRoutes.delete('orders/:order_id',  ordersControllers.deleteOrder)

export default ordersRoutes