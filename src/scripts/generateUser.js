import bcrypt from "bcrypt";
import db from "../helpers/server/db.js";

if (process.argv.length - 2 !== 2) {
  console.info(
    "ERROR: generateUsers requires 2 arguments: [username] [password]",
  );
  process.exit();
}

const username = process.argv[2];
const password = process.argv[3];

console.info("Hashing and salting password...");

const saltRounds = 10;

const addUserQuery = db.prepare(
  "INSERT INTO users (username, password) VALUES (?, ?)",
);

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Hashing error: ", err);
    process.exit(1);
  }

  addUserQuery.run(username, hash);

  console.info("Added user to the database.");

  process.exit();
});
