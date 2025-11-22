import type { Context } from "hono";
import { MenuItemsService } from "../menuitems/menu.services.ts";

export const getAllMenuItems = async (c: Context) => {
  try {
    const items = await MenuItemsService.getAll();
    return c.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return c.json(
      { success: false, message: "Failed to fetch menu items" },
      500
    );
  }
};

export const getMenuItemById = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const item = await MenuItemsService.getById(id);

    if (!item) {
      return c.json({ success: false, message: "Item not found" }, 404);
    }

    return c.json({ success: true, data: item });
  } catch (error) {
    console.error("Error fetching item:", error);
    return c.json(
      { success: false, message: "Failed to fetch item" },
      500
    );
  }
};

export const createMenuItem = async (c: Context) => {
  try {
    const body = await c.req.json();

    // Extract fields with defaults
    const newItem = {
      name: body.name,
      description: body.description ?? "",
      price: body.price,
      category_id: body.category_id ?? null,
      restaurant_id: body.restaurant_id ?? 1, // Default to restaurant 1
      menuitem_image_url: body.menuitem_image_url ?? null,
      quantity: body.quantity ?? 0,
      prepared_time: body.prepared_time ?? null,
      is_available: body.is_available ?? true
    };

    // Validate required fields
    if (!newItem.name || !newItem.price) {
      return c.json(
        { success: false, message: "Name and price are required" },
        400
      );
    }

    const item = await MenuItemsService.create(newItem);

    return c.json({ success: true, data: item }, 201);
  } catch (error) {
    console.error("Error creating item:", error);
    return c.json(
      { success: false, message: "Failed to create item" },
      500
    );
  }
};

export const updateMenuItem = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();

    // Check if item exists first
    const existingItem = await MenuItemsService.getById(id);
    if (!existingItem) {
      return c.json({ success: false, message: "Item not found" }, 404);
    }

    const updatedItem = {
      name: body.name,
      description: body.description,
      price: body.price,
      category_id: body.category_id,
      menuitem_image_url: body.menuitem_image_url,
      is_available: body.is_available,
      quantity: body.quantity,
      prepared_time: body.prepared_time
    };

    const updated = await MenuItemsService.update(id, updatedItem);

    if (!updated) {
      return c.json({ success: false, message: "Failed to update item" }, 500);
    }

    return c.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating item:", error);
    return c.json(
      { success: false, message: "Failed to update item" },
      500
    );
  }
};

export const deleteMenuItem = async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));

    // Check if item exists first
    const existingItem = await MenuItemsService.getById(id);
    if (!existingItem) {
      return c.json({ success: false, message: "Item not found" }, 404);
    }

    const deleted = await MenuItemsService.delete(id);

    if (!deleted) {
      return c.json({ success: false, message: "Failed to delete item" }, 500);
    }

    return c.json({
      success: true,
      message: "Menu item and all associated orders deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    return c.json(
      { success: false, message: "Failed to delete item" },
      500
    );
  }
};