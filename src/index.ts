import { serve } from '@hono/node-server'
import { type Context, Hono } from 'hono'
import { limiter } from './middleware/rateLimiter.ts'
import { cors } from 'hono/cors' // ✅ Import CORS middleware
import userRoutes from './users/users.routes.ts'
import initDatabaseConnection from './db/db.config.ts'
import { logger } from 'hono/logger'
import { prometheus } from '@hono/prometheus'
import authRoutes from './auth/auth.routes.ts'
import menuItemsRoutes from './menuitems/menu.routes.ts'
import dataRoutes from './dashboard_data/dashboard_data.routes.ts'
import ordersRoutes from './orders/orders.routes.ts'
import categoryRoutes from './categories/categories.routes.ts'
import restaurantRoutes from './restaurant/restaurant.routes.ts'


const app = new Hono()

// ✅ Enable CORS for frontend (must come BEFORE other middleware/routes)
app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',// Your frontend dev URL
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// Prometheus middleware
const { printMetrics, registerMetrics } = prometheus()
app.use('*', registerMetrics)
app.get('/metrics', printMetrics)

// Apply logger middleware
app.use('*', logger())

// Apply rate limiter middleware
app.use(limiter)

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Kimani Restaurant',
  })
})

// API routes
app.get('/api', (c: Context) => {
  return c.json(
    {
      message: 'Welcome to our maiden Restaurant. How can we help you?',
    },
    200
  )
})

// ✅ Mount API routes (auth and users)
app.route('/api', userRoutes)
app.route('/api', authRoutes)
app.route('/api', menuItemsRoutes)
app.route('/api', dataRoutes)
app.route('/api', ordersRoutes)
app.route('/api', categoryRoutes)
app.route('/api', restaurantRoutes)

// 404 handler
app.notFound((c: Context) => {
  return c.json(
    {
      success: false,
      message: 'Route not found',
      path: c.req.path,
    },
    404
  )
})

// Start server after DB connection
const port = Number(process.env.PORT) || 3000

initDatabaseConnection()
  .then(() => {
    serve(
      {
        fetch: app.fetch,
        port,
      },
      (info) => {
        console.log(`🚀 Server is running on http://localhost:${info.port}`)
      }
    )
  })
  .catch((error) => {
    console.error('Failed to initialize database connection:', error)
  })
