// ── ASYNC ERROR HANDLING WRAPPER MIDDLEWARE ──
// Wraps async route handlers to catch promise rejections
// Prevents unhandled promise rejection crashes

import { Request, Response, NextFunction } from 'express';

/**
 * Higher-order function that wraps async route handlers
 * Automatically catches promise rejections and passes them to Express error middleware
 * 
 * Pattern: Higher-order function that returns a middleware function
 * 
 * @param fn - Async route handler function (req, res, next) => Promise<void>
 * @returns - Express middleware function that catches errors
 * 
 * @example
 * router.get('/', asyncWrapper(controller.getBooks));
 * // If controller.getBooks throws or rejects, error is passed to error handler
 */
const asyncWrapper = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction): void => {
    // ── EXECUTE HANDLER AND CATCH ERRORS ──
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncWrapper;