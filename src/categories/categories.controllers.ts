import { type Context } from "hono"
import * as categoryService from "./categories.services.ts"


export const getAllCategories = async (c: Context) => {
    const categories = await categoryService.getAllCategoriesService();
    if (categories.length === 0) {
        return c.json({ message: 'No categories found' }, 404);
    }
    return c.json(categories);
}


//get category by category_id
export const getCategoryById = async (c: Context) => {
     const category_id = parseInt(c.req.param('category_id'))
    try {
        const result = await categoryService.getCategoryByIdService(category_id);
        if (result === null) {
            return c.json({ error: 'Category not found' }, 404);
        }
        return c.json(result);
    } catch (error) {
        console.error('Error fetching category:', error);
        return c.json({ error: 'Failed to fetch category' }, 500);
    }
}

//create new category
export const createCategory = async (c:Context) => {

    const body = await c.req.json() as  {restaurant_id:number,name:string,description:string}
    try {
        const result = await categoryService.createCategoryService(body.restaurant_id, body.name, body.description);
        if (result === "Failed create category try again") {
            return c.json({ message: result }, 500);
        }else {
            return c.json({ message: result}, 200);
        }
    } catch (error) {
        console.error('Error creating category:', error);
        return c.json({ error: 'Failed to create category' }, 500);
    }
}

export const updateCategory = async (c:Context) => {
    const category_id = Number(c.req.param('category_id'))
    const body = await c.req.json() as  {name?:string,description?:string,is_active?:boolean}
    try {

        //check if category exists
        const checkIfExists = await categoryService.getCategoryByIdService(category_id);
        // console.log("🚀 ~ updateTodo ~ check:", check)
        if (checkIfExists === null) {
            return c.json({ error: 'Category not found' }, 404);
        }
        const result = await categoryService.updateCategoryByIdService(category_id, body.name || '', body.description || '', body.is_active || false);
        if (result === "Failed to update category try again") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result}, 200);
    } catch (error) {
        console.error('Error updating category:', error);
        return c.json({ error: 'Failed to update category' }, 500);
    }
}

export const deleteCategory = async(c:Context) => {
    const category_id = parseInt(c.req.param('category_id'))

    try {
        //check if category exists
        const check = await categoryService.getCategoryByIdService(Number(category_id));
        if (check === null) {
            return c.json({ error: 'Category not found' }, 404);
        }
        //delete category
        const result = await categoryService.deleteCategoryService(category_id);
        if (result === "Failed to delete category") {
            return c.json({ error: result }, 500);
        }
        return c.json({ message: result }, 200);
    } catch (error) {
        console.error('Error deleting category:', error);
        return c.json({ error: 'Failed to delete category' }, 500);
    }
}