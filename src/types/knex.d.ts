// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      hash: string;
      salt: string;
      created_at: string;
    };
    meals: {
      id: string;
      name: string;
      description: string;
      date: Date;
      hour: string;
      is_on_diet: boolean;
      user_id: string;
    };
  }
}
