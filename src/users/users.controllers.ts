import { type Context } from "hono"
import * as userServices from "./users.services.ts";
import bcrypt from "bcryptjs";

//get all users
export const getAllUsers = async (c: Context) => {
    try {
        const result = await userServices.getAllUsersService();
        if (result.length === 0) {
            return c.json({ message: 'No users found' }, 404);
        }
        return c.json(result);
    } catch (error: any) {
        console.error('Error fetching users:', error.message);
        return c.json({ error: 'Failed to fetch users' }, 500);
    }
}

//get user by user_id
export const getUserById = async (c: Context) => {
    const user_id = parseInt(c.req.param('user_id'))
    try {
        const result = await userServices.getUserByIdService(user_id);
        if (result === null) {
            return c.json({ error: 'User not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching user:', error);
        return c.json({ error: 'Failed to fetch user' }, 500);
    }
}

//update user by user_id - FIXED VERSION
export const updateUser = async (c: Context) => {
    try {
        const user_id = parseInt(c.req.param('user_id'))
        const body = await c.req.json()

        //check if user exists
        const checkExists = await userServices.getUserByIdService(user_id);
        if (checkExists === null) {
            return c.json({ error: 'User not found' }, 404);
        }

        // Use existing password if no new password provided
        let passwordToUse = checkExists.password; 
        
        // Only hash and update password if it's provided in the request
        if (body.password && body.password.trim() !== '') {
            const saltRounds = bcrypt.genSaltSync(10);
            passwordToUse = bcrypt.hashSync(body.password, saltRounds);
        }

        const result = await userServices.updateUserService(
            user_id, 
            body.first_name || checkExists.first_name,
            body.last_name || checkExists.last_name, 
            body.email || checkExists.email, 
            body.phone_number || checkExists.phone_number, 
            passwordToUse // Always pass a string
        );

        if (result === null) {
            return c.json({ error: 'Failed to update user' }, 404);
        }

        return c.json({ message: 'User updated successfully', updated_user: result }, 200);

    } catch (error) {
        console.error('Error updating user:', error);
        return c.json({ error: 'Failed to update user' }, 500);
    }
}

//delete user by user_id
export const deleteUser = async (c: Context) => {
    const user_id = parseInt(c.req.param('user_id'))
    try {
        //check if user exists
        const check = await userServices.getUserByIdService(user_id);
        if (check === null) {
            return c.json({ error: 'User not found' }, 404);
        }

        //delete user if exists
        const result = await userServices.deleteUserService(user_id);
        if (result === null) {
            return c.json({ error: 'Failed to delete user' }, 404);
        }

        return c.json({ message: 'User deleted successfully', deleted_user: result }, 200);
    } catch (error) {
        console.error('Error deleting user:', error);
        return c.json({ error: 'Failed to delete user' }, 500);
    }
}