// ── TYPE INDEX/BARREL FILE ──
// Re-exports all type definitions from a single entry point for cleaner imports

/**
 * Central export point for all application types
 * Allows importing from single file instead of multiple type files
 * 
 * Usage: import { Livre, Adherent, Emprunt, ApiError } from '../types/index.ts'
 * Instead of: 
 *   import { Livre } from './livre.ts'
 *   import { Adherent } from './adherent.ts'
 *   import { Emprunt } from './emprunt.ts'
 */
export * from './livre.js';
export * from './adherent.js';
export * from './emprunt.js';
export * from './api.js';