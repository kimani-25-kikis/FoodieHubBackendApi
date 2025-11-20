import { getDbPool } from "../db/db.config.ts"

interface AdminDashboardData {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalMenuItems: number;
}

interface UserDashboardData {
    totalOrders: number,
    favoriteItems: number,
    totalSpent: number,
    loyaltyPoints: number
}

//get all orders,revenue, customers and totalmenuitems
export const getAdminDashboardData = async (): Promise<AdminDashboardData> => {
    const db = getDbPool();

    try {
        // Get total orders
        const ordersResult = await db.request().query('SELECT COUNT(*) as totalOrders FROM OrdersTable');
        const totalOrders = ordersResult.recordset[0]?.totalOrders || 0;

        // Get total revenue (sum of all completed orders)
        const revenueResult = await db.request().query("SELECT ISNULL(SUM(total_amount), 0) as totalRevenue FROM OrdersTable WHERE status = 'completed'");
        const totalRevenue = revenueResult.recordset[0]?.totalRevenue || 0;

        // Get total customers (users with customer type)
        const customersResult = await db.request().query("SELECT COUNT(*) as totalCustomers FROM Users WHERE user_type = 'customer'");
        const totalCustomers = customersResult.recordset[0]?.totalCustomers || 0;

        // Get total menu items
        const menuItemsResult = await db.request().query('SELECT COUNT(*) as totalMenuItems FROM MenuItems WHERE is_available = 1');
        const totalMenuItems = menuItemsResult.recordset[0]?.totalMenuItems || 0;

        const data: AdminDashboardData = {
            totalOrders,
            totalRevenue,
            totalCustomers,
            totalMenuItems
        };

        return data;
    } catch (error) {
        console.error('Error in getAdminDashboardData:', error);
        throw error;
    }
}

//get user dashboard data - orders, favorite items, total spent, loyalty points
export const getUserDashboardData = async (user_id: number): Promise<UserDashboardData> => {
    const db = getDbPool();

    try {
        // Get user's total orders
        const ordersResult = await db.request()
            .input('user_id', user_id)
            .query('SELECT COUNT(*) as totalOrders FROM OrdersTable WHERE customer_id = @user_id');
        const totalOrders = ordersResult.recordset[0]?.totalOrders || 0;

        // Get user's total spent (sum of completed orders)
        const spentResult = await db.request()
            .input('user_id', user_id)
            .query("SELECT ISNULL(SUM(total_amount), 0) as totalSpent FROM OrdersTable WHERE customer_id = @user_id AND status = 'completed'");
        const totalSpent = spentResult.recordset[0]?.totalSpent || 0;

        // Get user's favorite items count (distinct menu items ordered)
        const favoritesResult = await db.request()
            .input('user_id', user_id)
            .query('SELECT COUNT(DISTINCT menu_item_id) as favoriteItems FROM OrdersTable WHERE customer_id = @user_id');
        const favoriteItems = favoritesResult.recordset[0]?.favoriteItems || 0;

        // Calculate loyalty points (1 point per 100 spent)
        const loyaltyPoints = Math.floor(totalSpent / 100);

        const data: UserDashboardData = {
            totalOrders,
            favoriteItems,
            totalSpent,
            loyaltyPoints
        };

        return data;
    } catch (error) {
        console.error('Error in getUserDashboardData:', error);
        throw error;
    }
}