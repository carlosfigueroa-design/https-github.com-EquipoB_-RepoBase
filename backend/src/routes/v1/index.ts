import { Express } from 'express';
import catalogRoutes from './catalog.routes';
import authRoutes from './auth.routes';
import sandboxRoutes from './sandbox.routes';
import aiRoutes from './ai.routes';
import lifecycleRoutes from './lifecycle.routes';
import analyticsRoutes from './analytics.routes';
import observabilityRoutes from './observability.routes';
import { authMiddleware } from '../../middleware/auth.middleware';

/**
 * Registers all v1 API routes on the Express app.
 * Public routes are registered before the auth middleware.
 * Protected routes are registered after.
 */
export function registerRoutes(app: Express): void {
  // --- Public routes (no auth) ---
  app.use('/v1/api/catalog', catalogRoutes);
  app.use('/v1/api/auth', authRoutes);
  app.use('/v1/api/sandbox', sandboxRoutes);
  app.use('/v1/api/ai', aiRoutes);
  app.use('/v1/api/analytics', analyticsRoutes);
  app.use('/v1/api/observability', observabilityRoutes);

  // --- Auth middleware for all protected routes ---
  app.use('/v1/api', authMiddleware);

  // --- Protected routes (Admin only) ---
  app.use('/v1/api/apis', lifecycleRoutes);
}
