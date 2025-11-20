import { type Context } from "hono"
import * as dashboardServices from "./dashboard_data.services.ts"; 

//get admin data
export const getAdminData = async (c: Context) => {
    try {
        const result = await dashboardServices.getAdminDashboardData();
        if (result == null) {
            return c.json({ message: 'No data found' }, 404);
        }

        return c.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('Error fetching admin data:', error.message);
        return c.json({ error: 'Failed to fetch admin data' }, 500);
    }
}

//get user data by user_id
export const getUserDataById = async (c: Context) => {
    const user_id = parseInt(c.req.param('user_id'))
    try {
        const result = await dashboardServices.getUserDashboardData(user_id);
        if (result == null) {
            return c.json({ error: 'User Data not found' }, 404);
        }        
        return c.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching user data :', error);
        return c.json({ error: 'Failed to fetch user data' }, 500);
    }
}