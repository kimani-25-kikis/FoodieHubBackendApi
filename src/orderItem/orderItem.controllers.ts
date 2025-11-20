import { type Context } from "hono"
import * as orderItemService from "./orderItem.services.ts"


export const getAllOrderItems = async (c: Context) => {
    const orderItems = await orderItemService.getAllOrderItemsService();
    if (orderItems.length === 0) {
        return c.json({ message: 'No order items found' }, 404);
    }
    return c.json(orderItems);
}


//get order item by order_item_id
export const getOrderItemById = async (c: Context) => {
     const order_item_id = parseInt(c.req.param('order_item_id'))
    try {
        const result = await orderItemService.getOrderItemByIdService(order_item_id);
        if (result === null) {
            return c.json({ error: 'Order Item not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching order item:', error);
        return c.json({ error: 'Failed to fetch order item' }, 500);
    }
}

//create new order item
export const createOrderItem = async (c:Context) => {

    const body = await c.req.json() as  {order_id:number,menu_item_id:string,quantity:number,unit_price:number,total_price:number}
    try {
        const result = await orderItemService.createOrderItemService(body.order_id, body.menu_item_id, body.quantity, body.unit_price, body.total_price);
        if (result === "Failed create order item try again") {
            return c.json({ message: result }, 500);
        }else {
            return c.json({ message: result}, 200);
        }
    } catch (error) {
        console.error('Error creating order item:', error);
        return c.json({ error: 'Failed to create order item' }, 500);
    }
}

export const updateOrderItem = async (c:Context) => {
    const order_item_id = Number(c.req.param('order_item_id'))
    const body = await c.req.json() as  {menu_item_id?:string,quantity?:number,unit_price?:number,total_price?:number}
    try {

        //check if order item exists
        const checkIfExists = await orderItemService.getOrderItemByIdService(order_item_id);
        // console.log("🚀 ~ updateTodo ~ check:", check)
        if (checkIfExists === null) {
            return c.json({ error: 'Order Item not found' }, 404);
        }
        const result = await orderItemService.updateOrderItemByIdService(order_item_id, body.menu_item_id || '', body.quantity || 0, body.unit_price || 0, body.total_price || 0);
        if (result === "Failed to update order item try again") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result}, 200);
    } catch (error) {
        console.error('Error updating order item:', error);
        return c.json({ error: 'Failed to update order item' }, 500);
    }
}

export const deleteOrderItem = async(c:Context) => {
    const order_item_id = parseInt(c.req.param('order_item_id'))

    try {
        //check if order item exists
        const check = await orderItemService.getOrderItemByIdService(Number(order_item_id));
        if (check === null) {
            return c.json({ error: 'Order Item not found' }, 404);
        }
        //delete order item
        const result = await orderItemService.deleteOrderItemService(order_item_id);
        if (result === "Failed to delete order item") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting order item:', error);
        return c.json({ error: 'Failed to delete order item' }, 500);
    }
}