import { type Context } from "hono"
import * as restaurantService from "./restaurant.services.ts"


export const getAllRestaurants = async (c: Context) => {
    const restaurants = await restaurantService.getAllRestaurantService();
    if (restaurants.length === 0) {
        return c.json({ message: 'No restaurants found' }, 404);
    }
    return c.json(restaurants);
}


//get restaurant by restaurant_id
export const getRestaurantById = async (c: Context) => {
     const restaurant_id = parseInt(c.req.param('restaurant_id'))
    try {
        const result = await restaurantService.getRestaurantByIdService(restaurant_id);
        if (result === null) {
            return c.json({ error: 'Restaurant not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        return c.json({ error: 'Failed to fetch restaurant' }, 500);
    }
}

//create new restaurant 
export const createRestaurant = async (c:Context) => {

    const body = await c.req.json() as  {name:string,description:string,address:string,city:string,phone_number:string,email:string,opening_time:string,closing_time:string,cuisine_type:string}
    try {
        const result = await restaurantService.createRestaurantService(body.name, body.description, body.address, body.city, body.phone_number, body.email, body.opening_time, body.closing_time, body.cuisine_type);
        if (result === "Failed create restaurant try again") {
            return c.json({ message: result }, 500);
        }else {
            return c.json({ message: result}, 200);
        }
    } catch (error) {
        console.error('Error creating restaurant:', error);
        return c.json({ error: 'Failed to create restaurant' }, 500);
    }
}

export const updateRestaurant = async (c:Context) => {
    const restaurant_id = Number(c.req.param('restaurant_id'))
    const body = await c.req.json() as  {name?:string,description?:string,address?:string,city?:string,phone_number?:string,email?:string,opening_time?:string,closing_time?:string,cuisine_type?:string}
    try {

        //check if restaurant exists
        const checkIfExists = await restaurantService.getRestaurantByIdService(restaurant_id);
        // console.log("🚀 ~ updateTodo ~ check:", check)
        if (checkIfExists === null) {
            return c.json({ error: 'Restaurant not found' }, 404);
        }
        const result = await restaurantService.updateRestaurantService(restaurant_id, body.name || '', body.description || '', body.address || '', body.city || '', body.phone_number || '', body.email || '', body.opening_time || '', body.closing_time || '', body.cuisine_type || '');
        if (result === "Failed to update restaurant try again") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result}, 200);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        return c.json({ error: 'Failed to update restaurant' }, 500);
    }
}

export const deleteRestaurant = async(c:Context) => {
    const restaurant_id = parseInt(c.req.param('restaurant_id'))
    
    try {
        //check if restaurant exists
        const check = await restaurantService.getRestaurantByIdService(Number(restaurant_id));
        if (check === null) {
            return c.json({ error: 'Restaurant not found' }, 404);
        }
        //delete restaurant
        const result = await restaurantService.deleteRestaurantService(restaurant_id);
        if (result === "Failed to delete restaurant") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        return c.json({ error: 'Failed to delete restaurant' }, 500);
    }
}