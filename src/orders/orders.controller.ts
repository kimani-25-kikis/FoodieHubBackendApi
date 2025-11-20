import { type Context } from "hono"
import * as ordersService from "./orders.services.ts"


export const getAllOrders = async (c: Context) => {
    const orders = await ordersService.getAllOrdersService();
    if (orders.length === 0) {
        return c.json(orders);
    }
    return c.json(orders);
}


//get all orders by customer_id
export const getAllOrdersByCustomerId = async (c: Context) => {
    const customer_id = parseInt(c.req.param('customer_id'))
    try {
        const orders = await ordersService.getAllOrdersByCustomerIdService(customer_id);
        if (orders.length === 0) {
            return c.json(orders);
        }
        return c.json(orders);
    } catch (error) {
        console.error('Error fetching orders by customer_id:', error);
        return c.json({ error: 'Failed to fetch orders' }, 500);
    }
}


//get order by order_id
export const getOrderById = async (c: Context) => {
     const order_id = parseInt(c.req.param('order_id'))
    try {
        const result = await ordersService.getOrderByIdService(order_id);
        if (result === null) {
            return c.json({ error: 'Order not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching order:', error);
        return c.json({ error: 'Failed to fetch order' }, 500);
    }
}

//create new order
export const createOrder = async (c:Context) => {

    const body = await c.req.json() as  {restaurant_id:number,menu_item_id:number,customer_id:number,order_type:string,total_amount:number}
    try {
        //
        const result = await ordersService.createOrderService(body.restaurant_id,body.menu_item_id, body.customer_id, body.order_type, body.total_amount);
        if (result === "Failed create order try again") {
            return c.json({ message: result }, 500);
        }else {
            return c.json({ message: result}, 200);
            //decrement menuitems with 1 on menutem
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return c.json({ error: 'Failed to create order' }, 500);
    }
}

export const updateOrder = async (c:Context) => {
    const order_id = Number(c.req.param('order_id'))
    const body = await c.req.json() as  {restaurant_id?:number,customer_id?:number,order_type?:string,total_amount?:number}
    try {

        //check if order exists
        const checkIfExists = await ordersService.getOrderByIdService(order_id);
        // console.log("🚀 ~ updateTodo ~ check:", check)
        if (checkIfExists === null) {
            return c.json({ error: 'Order not found' }, 404);
        }
        const result = await ordersService.updateOrderService(order_id, body.restaurant_id || 0, body.customer_id || 0, body.order_type || '', body.total_amount || 0);
        if (result === "Failed to update order try again") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result}, 200);
    } catch (error) {
        console.error('Error updating order:', error);
        return c.json({ error: 'Failed to update order' }, 500);
    }
}

//update order status
export const updateOrderStatus = async (c:Context) => {
    const order_id = Number(c.req.param('order_id'))
    const body = await c.req.json() as  {status:string}
    try {

        //check if order exists
        const checkIfExists = await ordersService.getOrderByIdService(order_id);
        // console.log("🚀 ~ updateTodo ~ check:", check)
        if (checkIfExists === null) {
            return c.json({ error: 'Order not found' }, 404);
        }
        const result = await ordersService.updteOrderStatusService(order_id, body.status);
        if (result === "Failed to update order try again") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result}, 200);
    } catch (error) {
        console.error('Error updating order:', error);
        return c.json({ error: 'Failed to update order' }, 500);
    }
}


export const deleteOrder = async(c:Context) => {
    const order_id = parseInt(c.req.param('order_id'))

    try {
        //check if order exists
        const check = await ordersService.getOrderByIdService(Number(order_id));
        if (check === null) {
            return c.json({ error: 'Order not found' }, 404);
        }
        //delete order
        const result = await ordersService.deleteOrderService(order_id);
        if (result === "Failed to delete order") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting order:', error);
        return c.json({ error: 'Failed to delete order' }, 500);
    }
}