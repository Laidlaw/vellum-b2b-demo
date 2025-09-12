import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW browser worker for both development and production
// This enables the demo to work with mock data in all environments
export const worker = setupWorker(...handlers);