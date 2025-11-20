
import { Hono } from "hono";
import {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../menuitems/menu.controllers.ts";

const menuItemsRoutes = new Hono();

menuItemsRoutes.get("/menu-items", getAllMenuItems);
menuItemsRoutes.get("/menu-items/:id", getMenuItemById);
menuItemsRoutes.post("/menu-items", createMenuItem);
menuItemsRoutes.put("/menu-items/:id", updateMenuItem);
menuItemsRoutes.delete("/menu-items/:id", deleteMenuItem);

export default menuItemsRoutes;
