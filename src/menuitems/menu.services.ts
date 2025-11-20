import { getDbPool } from "../db/db.config.ts";

export const MenuItemsService = {
  
  async getAll() {
    const pool = getDbPool();
    const result = await pool.request().query(`
      SELECT * FROM MenuItems ORDER BY menu_item_id DESC
    `);
    return result.recordset;
  },

  
  async getById(id: number) {
    const pool = getDbPool();
    const result = await pool
      .request()
      .input("id", id)
      .query(`
        SELECT * FROM MenuItems WHERE menu_item_id = @id
      `);

    return result.recordset[0] || null;
  },

  
  async create(data: {
    name: string;
    description?: string;
    price: number;
    category_id?: string;
    restaurant_id?:string
    menu_item_id?:string;
    menuitem_image_url?: string | null;
    is_available?: boolean;
    quantity?: number;
    prepared_time?: string | null;
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
          @prepared_time,
          @quantity
        )
      `);

    return result.recordset[0];
  },

  
  async update(id: number, data: any) {
    const pool = getDbPool();
    const result = await pool
      .request()
      .input("id", id)
      .input("name", data.name)
      .input("description", data.description)
      .input("price", data.price)
      .input("category_name", data.category_name)
      .input("menuitem_image_url", data.menuitem_image_url)
      .input("is_available", data.is_available)
      .input("quantity", data.quantity)
      .input("prepared_time", data.prepared_time)
      .query(`
        UPDATE MenuItems SET
          name = @name,
          description = @description,
          price = @price,
          category_name = @category_name,
          menuitem_image_url = @menuitem_image_url,
          is_available = @is_available,
          quantity = @quantity,
          prepared_time = @prepared_time,
          updated_at = SYSDATETIME()
        WHERE menu_item_id = @id
        OUTPUT INSERTED.*
      `);

    return result.recordset[0] || null;
  },

  
  async delete(id: number) {
  const pool = getDbPool();
  const result = await pool
    .request()
    .input("id", id)
    .query(`
      DELETE FROM MenuItems
      OUTPUT DELETED.*
      WHERE menu_item_id = @id
    `);

  return result.recordset[0] || null;
}

};
