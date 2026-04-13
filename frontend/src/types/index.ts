// ── Type Index/Barrel File ──
// Re-exports all types from a single entry point for cleaner imports

/**
 * Usage: import { Livre, Adherent, Emprunt } from '../types/index.ts'
 * Instead of importing from individual type files
 */
export * from './livre.js';
export * from './adherent.js';
export * from './emprunt.js';