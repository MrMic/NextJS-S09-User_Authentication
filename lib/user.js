import db from "./db";

// ______________________________________________________________________
export function createUser(email, password) {
  const result = db.prepare("INSERT INTO users (email, password) VALUES (?,?)").run(
    email,
    password
  );
  return result.lastInsertRowid;
}
