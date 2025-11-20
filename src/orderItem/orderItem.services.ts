import { getDbPool } from "../db/db.config.ts"

interface OrderItemResponse {
    order_item_id: number;
    order_id: number;
    menu_item_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    created_at: string;
}

//get all Order Items
export const getAllOrderItemsService = async (): Promise<OrderItemResponse[]> => {
    const db = getDbPool(); // Get existing connection instead of creating new one
    const result = await db.request().query('SELECT * FROM OrderItems');
    return result.recordset;
}

//get Order Item by order_item_id
export const getOrderItemByIdService = async (order_item_id: number): Promise<OrderItemResponse | null> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('order_item_id', order_item_id)
        .query('SELECT * FROM OrderItems WHERE order_item_id = @order_item_id');
    return result.recordset[0] || null;
}

//create new Order Item
export const createOrderItemService = async (order_id: number, menu_item_id: string, quantity: number, unit_price: number, total_price: number): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('order_id', order_id)
        .input('menu_item_id', menu_item_id)
        .input('quantity', quantity)
        .input('unit_price', unit_price)
        .input('total_price', total_price)
        .query('INSERT INTO OrderItems (order_id, menu_item_id, quantity, unit_price, total_price) OUTPUT INSERTED.* VALUES (@order_id, @menu_item_id, @quantity, @unit_price, @total_price)');
    return result.rowsAffected[0] === 1 ? "Order Item Created Successfully" : "Failed create Order Item try again"
}

//update Order Item by order_item_id
export const updateOrderItemService = async (order_item_id: number, menu_item_id: string, quantity: number, unit_price: number, total_price: number): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('order_item_id', order_item_id)
        .input('menu_item_id', menu_item_id)
        .input('quantity', quantity)
        .input('unit_price', unit_price)
        .input('total_price', total_price)
        .query('UPDATE OrderItems SET menu_item_id = @menu_item_id, quantity = @quantity, unit_price = @unit_price, total_price = @total_price WHERE order_item_id = @order_item_id');
    return result.rowsAffected[0] === 1 ? "Order Item Updated Successfully" : "Failed to update Order Item try again"
}


//update Order Item by order_item_id
export const updateOrderItemByIdService = async (order_item_id: number, menu_item_id: string, quantity: number, unit_price: number, total_price: number): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('order_item_id', order_item_id)
        .input('menu_item_id', menu_item_id)
        .input('quantity', quantity)
        .input('unit_price', unit_price)
        .input('total_price', total_price)
        .query('UPDATE OrderItems SET menu_item_id = @menu_item_id, quantity = @quantity, unit_price = @unit_price, total_price = @total_price WHERE order_item_id = @order_item_id');
    return result.rowsAffected[0] === 1 ? "Order Item Updated Successfully" : "Failed to update Order Item try again"
}

//delete Order Item by order_item_id
export const deleteOrderItemService = async (order_item_id: number): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('order_item_id', order_item_id)
        .query('DELETE FROM OrderItems OUTPUT DELETED.* WHERE order_item_id = @order_item_id');
    return result.rowsAffected[0] === 1 ? "Order Item deleted successfully" : "Failed to delete Order Item"
}
  