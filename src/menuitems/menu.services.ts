import { getDbPool } from "../db/db.config.ts";

export const MenuItemsService = {
  
  async getAll() {
    const pool = getDbPool();
    const result = await pool.request().query(`
      SELECT 
        mi.*,
        c.name as category_name
      FROM MenuItems mi
      LEFT JOIN Categories c ON mi.category_id = c.category_id
      ORDER BY mi.menu_item_id DESC
    `);
    return result.recordset;
  },

  
  async getById(id: number) {
    const pool = getDbPool();
    const result = await pool
      .request()
      .input("id", id)
      .query(`
        SELECT 
          mi.*,
          c.name as category_name
        FROM MenuItems mi
        LEFT JOIN Categories c ON mi.category_id = c.category_id
        WHERE mi.menu_item_id = @id
      `);

    return result.recordset[0] || null;
  },

  
  async create(data: {
    name: string;
    description?: string;
    price: number;
    category_id?: number;
    restaurant_id?: number;
    menuitem_image_url?: string | null;
    is_available?: boolean;
    quantity?: number;
    prepared_time?: number;
  }) {
    const pool = getDbPool();
    const result = await pool
      .request()
      .input("name", data.name)
      .input("description", data.description ?? "")
      .input("price", data.price)
      .input("category_id", data.category_id ?? null)
      .input("restaurant_id", data.restaurant_id ?? null)
      .input("menuitem_image_url", data.menuitem_image_url ?? null)
      .input("is_available", data.is_available ?? true)
      .input("quantity", data.quantity ?? 0)
      .input("prepared_time", data.prepared_time ?? null)
      .query(`
        INSERT INTO MenuItems 
        (
          restaurant_id,
          category_id,
          name, 
          description, 
          price, 
          menuitem_image_url,
          is_available,
          prepared_time,
          quantity
        )
        OUTPUT INSERTED.*
        VALUES 
        (
          @restaurant_id,
          @category_id,
          @name, 
          @description, 
          @price, 
          @menuitem_image_url,
          @is_available,
          @prepared_time,
          @quantity
        )
      `);

    return result.recordset[0];
  },

  
  async update(id: number, data: any) {
    const pool = getDbPool();
    
    try {
      // First get the current item to preserve unchanged values
      const currentItem = await this.getById(id);
      if (!currentItem) return null;

      // Prepare the update query - REMOVED updated_at since it doesn't exist
      const result = await pool
        .request()
        .input("id", id)
        .input("name", data.name ?? currentItem.name)
        .input("description", data.description ?? currentItem.description)
        .input("price", data.price ?? currentItem.price)
        .input("category_id", data.category_id ?? currentItem.category_id)
        .input("menuitem_image_url", data.menuitem_image_url ?? currentItem.menuitem_image_url)
        .input("is_available", data.is_available ?? currentItem.is_available)
        .input("quantity", data.quantity ?? currentItem.quantity)
        .input("prepared_time", data.prepared_time ?? currentItem.prepared_time)
        .query(`
          UPDATE MenuItems SET
            name = @name,
            description = @description,
            price = @price,
            category_id = @category_id,
            menuitem_image_url = @menuitem_image_url,
            is_available = @is_available,
            quantity = @quantity,
            prepared_time = @prepared_time
          WHERE menu_item_id = @id
        `);

      // Return the updated item
      if (result.rowsAffected[0] > 0) {
        return await this.getById(id);
      }
      return null;
      
    } catch (error) {
      console.error('Error in update service:', error);
      throw error;
    }
  },

  
  // In your menu.services.ts - Update the delete method
async delete(id: number) {
  const pool = getDbPool();
  
  try {
    // First delete all orders that reference this menu item
    await pool
      .request()
      .input("id", id)
      .query(`DELETE FROM OrdersTable WHERE menu_item_id = @id`);
    
    // Then delete the menu item
    const result = await pool
      .request()
      .input("id", id)
      .query(`DELETE FROM MenuItems WHERE menu_item_id = @id`);

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error in delete service:', error);
    throw error;
  }
}
};