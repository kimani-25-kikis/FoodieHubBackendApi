// Load environment variables automatically
import "dotenv/config";
import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";


interface DecodedToken {
    user_id: number;           
    first_name: string;        
    last_name: string;         
    email: string;             
    user_type: 'admin' | 'customer'; 
    iat: number;             
    exp: number;              
}


type UserRole = 'admin' | 'customer' | 'both';

declare module "hono" {
    interface Context {
        customer?: DecodedToken;  
    }
}

/**
 * Verifies the validity of a JWT token
 * @param token - The JWT token to verify
 * @param secret - The secret key used to sign the token
 * @returns Promise<DecodedToken | null> - Decoded token data or null if invalid
 */
export const verifyToken = async (token: string, secret: string): Promise<DecodedToken | null> => {
    try {
        
        const decoded = jwt.verify(token, secret) as DecodedToken;
        return decoded;
    } catch (error: any) {
        
        console.error('Token verification failed:', error.message);
        return null;
    }
}


/**
 * Main authentication and authorization middleware
 * Validates JWT tokens and checks user permissions for protected routes
 * 
 * @param c - Hono context object containing request/response data
 * @param next - Next middleware function in the chain
 * @param requiredRole - The role required to access this route ('admin', 'user', or 'both')
 * @returns Promise<Response | void> - JSON error response or proceeds to next middleware
 */

export const authMiddleware = async (c: Context, next: Next, requiredRole: UserRole) => {
  
    const authHeader = c.req.header("Authorization");

    
    if (!authHeader) {
        return c.json({ error: "Authorization header is required" }, 401);
    }

    
    if (!authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Bearer token is required" }, 401);
    }

   
    const token = authHeader.substring(7);

    
    const decoded = await verifyToken(token, process.env.JWT_SECRET as string);

    
    if (!decoded) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }

    
    if (requiredRole === "both") {
        
        if (decoded.user_type === "admin" || decoded.user_type === "customer") {
            c.customer = decoded;  
            return next();     
        }
    } else if (decoded.user_type === requiredRole) {
        
        c.customer = decoded;  
        return next();     
    }

    // User doesn't have sufficient permissions
    return c.json({ error: "Insufficient permissions" }, 403);
}


export const adminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "admin");


export const customerRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "customer");


export const bothRolesAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "both");