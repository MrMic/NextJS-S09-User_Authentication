'use server';

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";

export async function signup(_prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  let errors = {};

  if (!email.includes('@')) {
    errors.email = 'Email is invalid';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // * INFO: Create new user in DB w/ secured hashed password!
  const hashedPassword = hashUserPassword(password);
  createUser(email, hashedPassword)
}
