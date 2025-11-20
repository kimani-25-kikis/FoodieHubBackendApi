import { getDbPool } from "../db/db.config.ts"

interface RestaurantResponse {
    restaurant_id: number;
    name: string;
    description: string;
    address: string;
    city: number;
    phone_number: string;
    email: number;
    opening_time: string;
    closing_time: number;
    cuisine_type: string;
}

//get all Restaurants
export const getAllRestaurantService = async (): Promise<RestaurantResponse[]> => {
    const db = getDbPool(); // Get existing connection instead of creating new one
    const result = await db.request().query('SELECT * FROM Restaurants');
    return result.recordset;
}

//get Restaurant by todo_id
export const getRestaurantByIdService = async (restaurant_id: number): Promise<RestaurantResponse | null> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('restaurant_id', restaurant_id)
        .query('SELECT * FROM Restaurants WHERE restaurant_id = @restaurant_id');
    return result.recordset[0] || null;
}

//create new Restaurant
export const createRestaurantService = async (name: string, description: string, address: string, city: string, phone_number: string, email: string, opening_time: string, closing_time: string, cuisine_type: string): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('name', name)
        .input('description', description)
        .input('address', address)
        .input('city', city)
        .input('phone_number', phone_number)
        .input('email', email)
        .input('opening_time', opening_time)
        .input('closing_time', closing_time)
        .input('cuisine_type', cuisine_type)
        .query('INSERT INTO Restaurants (name, description, address, city,email,opening_time,closing_time,cuisine_type) OUTPUT INSERTED.* VALUES (@name, @description, @address, @city,@email,@opening_time,@closing_time,@cuisine_type)');
    return result.rowsAffected[0] === 1 ? "Restaurant Created Successfully" : "Failed create restaurant try again"
}

//update Restaurant by Restaurant_id
export const updateRestaurantService = async (restaurant_id: number, name: string, description: string, address: string, city: string, phone_number: string, email: string, opening_time: string, closing_time: string, cuisine_type: string): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('restaurant_id', restaurant_id)
        .input('name', name)
        .input('description', description)
        .input('address', address)
        .input('city', city)
        .input('phone_number', phone_number)
        .input('email', email)
        .input('opening_time', opening_time)
        .input('closing_time', closing_time)
        .input('cuisine_type', cuisine_type)
        .query('UPDATE Restaurants SET name = @name, description = @description, address = @address, city = @city,phone_number = @phone_number,email = @email,opening_time = @opening_time, closing_time = @closing_time,cuisine_type = @cuisine_type OUTPUT INSERTED.* WHERE restaurant_id = @restaurant_id');
    return result.rowsAffected[0] === 1 ? "Rerestaurant Updated Successfully" : "Failed to update restaurant try again"
}

//delete restaurant by restaurant_id
export const deleteRestaurantService = async (restaurant_id: number): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('restaurant_id', restaurant_id)
        .query('DELETE FROM Restaurants OUTPUT DELETED.* WHERE restaurant_id = @restaurant_id');
    return result.rowsAffected[0] === 1 ? "Restaurant deleted successfully" : "Failed to delete restaurant"
}