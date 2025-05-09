import sqlite from "better-sqlite3";
import cron from "node-cron";

const db = new sqlite(process.env.DATABASE_URL);

// Enable foreign_keys, we need to do this every time the database is opened
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

const deleteOldSessions = () => {
  try {
    db.prepare(
      "DELETE FROM sessions WHERE datetime(created_at) <= datetime('now', '-3 months')",
    ).run();

    console.info("\n ---------------- DELETED OLD SESSIONS ---------------- \n");
  } catch (err) {
    console.error(
      "\n ---------------- ERROR DELETING OLD SESSIONS: ---------------- \n",
    );
    console.error(err);
  }
};

const backupDatabase = () => {
  db.backup(process.env.BACKUP_DB_URL)
    .then(() => {
      console.info("\n ---------------- DATABASE BACKED UP ---------------- \n");
    })
    .catch((err) => {
      console.error(
        "\n ---------------- DATABASE BACKUP FAILED: ---------------- \n",
      );
      console.error(err);
    });
};

const ONCE_A_DAY = "0 0 * * *";

cron.schedule(ONCE_A_DAY, deleteOldSessions);
cron.schedule(ONCE_A_DAY, backupDatabase);

export default db;
