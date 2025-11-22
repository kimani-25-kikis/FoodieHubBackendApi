import { getDbPool } from "../db/db.config.ts"

interface OrdersResponse {
    order_id: number;
    restaurant_id: number;
    customer_id: number;
    menu_item_id: number;
    order_type: string;
    total_amount: number;
    status: string;
    restaurant_name: string;
    customer_name: string;
    customer_email: string;
    menu_item_name: string;
    created_at: string;
}

//get all Orders  //admin route
export const getAllOrdersService = async (): Promise<OrdersResponse[] | []> => {
    const db = getDbPool();
    //fetch and join with restaurant, customer and menu item tables to get names use INNER JOIN
    const query = `SELECT o.*, r.name AS restaurant_name, c.first_name AS customer_name, c.email AS customer_email, m.name AS menu_item_name,m.menuitem_image_url AS menuitem_image_url
        FROM OrdersTable o
        INNER JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        INNER JOIN Users c ON o.customer_id = c.user_id
        INNER JOIN MenuItems m ON o.menu_item_id = m.menu_item_id`;

    const result = await db.request().query(query);
    return result.recordset.length > 0 ? result.recordset : [];
}

//get All Orders by customer_id   //user route
export const getAllOrdersByCustomerIdService = async (customer_id: number): Promise<Omit<OrdersResponse[],'customer_name'|' customer_email'> | []> => {
    const db = getDbPool();
    const query = `SELECT o.*, r.name AS restaurant_name,  m.name AS menu_item_name
        FROM OrdersTable o
        INNER JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        INNER JOIN MenuItems m ON o.menu_item_id = m.menu_item_id
        WHERE o.customer_id = @user_id`;
    const result = await db.request()
        .input('user_id', customer_id)
        .query(query);
    return result.recordset.length > 0 ? result.recordset : [];
}

//get Order by order_id
export const getOrderByIdService = async (order_id: number): Promise<OrdersResponse | null> => {
    const db = getDbPool(); // Get existing connection
    const query = `SELECT o.*, r.name AS restaurant_name, c.first_name AS customer_name, c.email AS customer_email, m.name AS menu_item_name
        FROM OrdersTable o
        INNER JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
        INNER JOIN Users c ON o.customer_id = c.user_id
        INNER JOIN MenuItems m ON o.menu_item_id = m.menu_item_id
        WHERE o.order_id = @order_id`;
    const result = await db.request()
        .input('order_id', order_id)
        .query(query);
    return result.recordset[0] || null;
}

//create new Order
export const createOrderService = async (restaurant_id: number, menu_item_id: number, customer_id: number, order_type: string, total_amount: number): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('restaurant_id', restaurant_id)
        .input('menu_item_id', menu_item_id)
        .input('customer_id', customer_id)
        .input('order_type', order_type)
        .input('total_amount', total_amount)
        .query('INSERT INTO OrdersTable (restaurant_id, menu_item_id, customer_id, order_type, total_amount) OUTPUT INSERTED.* VALUES (@restaurant_id, @menu_item_id, @customer_id, @order_type, @total_amount)');
    return result.rowsAffected[0] === 1 ? "Order Created Successfully" : "Failed create order try again"
}

//update Order by Order_id
export const updateOrderService = async (order_id: number, restaurant_id: number, customer_id: number, order_type: string, total_amount: number): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('order_id', order_id)
        .input('restaurant_id', restaurant_id)
        .input('customer_id', customer_id)
        .input('order_type', order_type)
        .input('total_amount', total_amount)
        .query('UPDATE OrdersTable SET restaurant_id = @restaurant_id, customer_id = @customer_id, order_type = @order_type, total_amount = @total_amount WHERE order_id = @order_id');
    return result.rowsAffected[0] === 1 ? "Order Updated Successfully" : "Failed to update order try again"
}

//update order status 
export const updteOrderStatusService= async(order_id: number,status:string)=>{
      const db = getDbPool();
    const result = await db.request()
        .input('order_id', order_id)
        .input('status', status)        
        .query('UPDATE OrdersTable SET status = @status WHERE order_id = @order_id');
    return result.rowsAffected[0] === 1 ? "Order Updated Successfully" : "Failed to update order try again"
}

//update Order by Order_id
export const updateOrderByIdService = async (order_id: number, restaurant_id: number, customer_id: number, order_type: string, total_amount: number): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('order_id', order_id)
        .input('restaurant_id', restaurant_id)
        .input('customer_id', customer_id)
        .input('order_type', order_type)
        .input('total_amount', total_amount)
        .query('UPDATE OrdersTable SET restaurant_id = @restaurant_id, customer_id = @customer_id, order_type = @order_type, total_amount = @total_amount WHERE order_id = @order_id');
    return result.rowsAffected[0] === 1 ? "Order Updated Successfully" : "Failed to update order try again"
}

//delete Order by Order_id
export const deleteOrderService = async (order_id: number): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('order_id', order_id)
        .query('DELETE FROM OrdersTable OUTPUT DELETED.* WHERE order_id = @order_id');
    return result.rowsAffected[0] === 1 ? "Order deleted successfully" : "Failed to delete order"
}
// services/order.service.ts - For getting user's recent orders
export const getUserRecentOrders = async (user_id: number, limit: number = 5) => {
    const db = getDbPool();
    
    try {
        const result = await db.request()
            .input('user_id', user_id)
            .input('limit', limit)
            .query(`
                SELECT TOP (@limit)
                    o.order_id as id,
                    r.name as restaurant,
                    mi.name as items,
                    o.total_amount as amount,
                    o.status,
                    FORMAT(o.created_at, 'MMM dd, yyyy') as date,
                    0 as rating -- You can add ratings later
                FROM OrdersTable o
                LEFT JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
                LEFT JOIN MenuItems mi ON o.menu_item_id = mi.menu_item_id
                WHERE o.customer_id = @user_id
                ORDER BY o.created_at DESC
            `);

        return result.recordset;
        
    } catch (error) {
        console.error('Error fetching user recent orders:', error);
        throw error;
    }
};
