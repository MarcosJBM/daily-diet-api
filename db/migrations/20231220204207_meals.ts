import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', table => {
    table.uuid('id').notNullable().primary();
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.date('date').notNullable();
    table.time('hour').notNullable();
    table.boolean('is_on_diet').notNullable();
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
