import db from "../helpers/server/db.js";

console.info("Initializing database...");

db.prepare(
  "CREATE TABLE users ( id integer primary key , username text not null unique, password text not null);",
).run();
console.info("Created users table");

db.prepare(
  "CREATE TABLE sessions ( session_id integer primary key, user_id integer not null, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, session_uuid text not null, FOREIGN KEY (user_id) REFERENCES users(id) on delete cascade );",
).run();
console.info("Created sessions table");

db.prepare(
  "CREATE TABLE pages ( page_id integer primary key, slug text not null, user_id integer not null, page_uuid text not null, page_order integer not null, page_title text not null, FOREIGN KEY(user_id) references users(id) on delete cascade );",
).run();
console.info("Created pages table");

db.prepare(
  "CREATE TABLE tabs ( tab_id integer primary key, title text not null, page_id integer not null, tab_order integer not null, tab_type text not null, text_content text, generation integer not null, deleted_cards_count integer not null, foreign key(page_id) references pages(page_id) on delete cascade );",
).run();
console.info("Created tabs table");

db.prepare(
  "CREATE TABLE kanban_categories ( category_id integer primary key, tab_id integer not null, title text not null, category_order integer not null, compact INTEGER NOT NULL, foreign key(tab_id) references tabs(tab_id) on delete cascade );",
).run();
console.info("Created kanban_categories table");

db.prepare(
  "CREATE TABLE kanban_cards ( card_id integer primary key, category_id integer, tab_id integer not null, title text not null, description text not null, generation integer not null, card_order integer not null, deleted INTEGER NOT NULL, deleted_at TIMESTAMP, updated_at TIMESTAMP, foreign key(category_id) references kanban_categories(category_id) on delete cascade, foreign key(tab_id) references tabs(tab_id) on delete cascade );",
).run();
console.info("Created kanban_cards table");

db.prepare("CREATE INDEX idx_tabs ON tabs(tab_id);").run();
console.info("Created idx_tabs index");

db.prepare(
  "CREATE INDEX idx_categories ON kanban_categories(category_id, tab_id, category_order);",
).run();
console.info("Created idx_categories index");

db.prepare(
  "CREATE INDEX idx_cards ON kanban_cards(card_id, card_order);",
).run();
console.info("Created idx_cards index");
