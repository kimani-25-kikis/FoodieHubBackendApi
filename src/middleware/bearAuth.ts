// Load environment variables automatically
import "dotenv/config";
import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

/**
 * Interface representing the decoded JWT token payload
 * This structure matches what we store in the JWT when user logs in
 */
interface DecodedToken {
    user_id: number;           // Unique identifier for the user
    first_name: string;        // User's first name
    last_name: string;         // User's last name
    email: string;             // User's email address
    user_type: 'admin' | 'customer'; // User's role in the system
    iat: number;               // JWT issued at timestamp
    exp: number;               // JWT expiration timestamp
}

/**
 * Defines the possible user roles for authorization
 * - 'admin': Administrative users with elevated privileges
 * - 'user': Regular users with standard privileges  
 * - 'both': Allows both admin and user roles
 */
type UserRole = 'admin' | 'customer' | 'both';

/**
 * Extend Hono's Context interface to include decoded user information
 * This allows us to access user data throughout the request lifecycle
 * after successful authentication
 */
declare module "hono" {
    interface Context {
        customer?: DecodedToken;  // Optional user object populated after auth
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
        // Verify and decode the JWT token using the provided secret
        const decoded = jwt.verify(token, secret) as DecodedToken;
        return decoded;
    } catch (error: any) {
        // Return null for any verification errors (expired, invalid signature, etc.)
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
    // Extract the Authorization header from the request
    const authHeader = c.req.header("Authorization");

    // Check if Authorization header is present
    if (!authHeader) {
        return c.json({ error: "Authorization header is required" }, 401);
    }

    // Validate that the header follows the Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Bearer token is required" }, 401);
    }

    // Extract the actual token by removing "Bearer " prefix (7 characters)
    const token = authHeader.substring(7);

    // Verify the token using our secret key from environment variables
    const decoded = await verifyToken(token, process.env.JWT_SECRET as string);

    // If token verification fails, return unauthorized error
    if (!decoded) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }

    // Check if user has the required role for this route
    if (requiredRole === "both") {
        // Allow access for both admin and user roles
        if (decoded.user_type === "admin" || decoded.user_type === "customer") {
            c.customer = decoded;  // Attach user data to context for use in route handlers
            return next();     // Proceed to the next middleware/route handler
        }
    } else if (decoded.user_type === requiredRole) {
        // User has the exact required role
        c.customer = decoded;  // Attach user data to context
        return next();     // Proceed to the next middleware/route handler
    }

    // User doesn't have sufficient permissions
    return c.json({ error: "Insufficient permissions" }, 403);
}

/**
 * Pre-configured middleware functions for common authorization scenarios
 * These provide convenient shortcuts for protecting routes with specific roles
 */

/**
 * Admin-only authorization middleware
 * Only allows users with 'admin' role to access the route
 */
export const adminRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "admin");

/**
 * User-only authorization middleware  
 * Only allows users with 'user' role to access the route
 */
export const customerRoleAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "customer");

/**
 * Both roles authorization middleware
 * Allows both 'admin' and 'user' roles to access the route
 */
export const bothRolesAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "both");