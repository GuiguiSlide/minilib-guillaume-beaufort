// backend/src/middleware/asyncWrapper.js
import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to automatically catch promise rejections.
 * Passes errors to the Express error middleware via next().
 */
const asyncWrapper = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncWrapper;