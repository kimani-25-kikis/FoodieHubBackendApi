import { getDbPool } from "../db/db.config.ts"

interface CategoryResponse {
    category_id: number;
    restaurant_id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
}

//get all Categories
export const getAllCategoriesService = async (): Promise<CategoryResponse[]> => {
    const db = getDbPool(); // Get existing connection instead of creating new one
    const result = await db.request().query('SELECT * FROM Categories');
    return result.recordset;
}

//get Category by category_id
export const getCategoryByIdService = async (category_id: number): Promise<CategoryResponse | null> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('category_id', category_id)
        .query('SELECT * FROM Categories WHERE category_id = @category_id');
    return result.recordset[0] || null;
}

//create new Category
export const createCategoryService = async (restaurant_id: number, name: string, description: string): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('restaurant_id', restaurant_id)
        .input('name', name)
        .input('description', description)
        .query('INSERT INTO Categories (restaurant_id, name,  description) OUTPUT INSERTED.* VALUES (@restaurant_id, @name,  @description)');
    return result.rowsAffected[0] === 1 ? "Category Created Successfully" : "Failed create category try again"
}

//update Category by Category_id
export const updateCategoryService = async (restaurant_id: number, name: string, description: string, is_active: boolean): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('restaurant_id', restaurant_id)
        .input('name', name)
        .input('description', description)
        .input('is_active', is_active)
        .query('UPDATE Categories SET name = @name, description = @description, is_active = @is_active WHERE restaurant_id = @restaurant_id');
    return result.rowsAffected[0] === 1 ? "Category Updated Successfully" : "Failed to update category try again"
}

//update Category by category_id
export const updateCategoryByIdService = async (category_id: number, name: string, description: string, is_active: boolean): Promise<string> => {
    const db = getDbPool();
    const result = await db.request()
        .input('category_id', category_id)
        .input('name', name)
        .input('description', description)
        .input('is_active', is_active)
        .query('UPDATE Categories SET name = @name, description = @description, is_active = @is_active WHERE category_id = @category_id');
    return result.rowsAffected[0] === 1 ? "Category Updated Successfully" : "Failed to update category try again"
}

//delete category by category_id
export const deleteCategoryService = async (category_id: number): Promise<string> => {
    const db = getDbPool(); // Get existing connection
    const result = await db.request()
        .input('category_id', category_id)
        .query('DELETE FROM Categories OUTPUT DELETED.* WHERE category_id = @category_id');
    return result.rowsAffected[0] === 1 ? "Category deleted successfully" : "Failed to delete category"
}
  