// Re-exports everything so both import styles work:
// import type { Product } from '@/types'           works
// import type { Product } from '@/types/database'  also works
export * from './database';
export * from './api';
