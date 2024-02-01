import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('metrics', table => {
    table.uuid('id').notNullable().primary();
    table.integer('registered_meals').notNullable();
    table.integer('best_sequence').notNullable();
    table.integer('current_sequence').notNullable();
    table.integer('off_the_diet').notNullable();
    table.integer('within_the_diet').notNullable();
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('users.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('metrics');
}
