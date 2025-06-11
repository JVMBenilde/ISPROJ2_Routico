import { Pool } from 'mysql2/promise';

export const db: {
  query: (sql: string, params?: any[]) => Promise<any>;
};
