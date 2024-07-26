'use server';

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

// ______________________________________________________________________
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
  try {
    const id = createUser(email, hashedPassword)

    // * INFO: Create new session in DB
    await createAuthSession(id);
    redirect('/training')

  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors:
          { email: 'Email already exists' }
      };
    }
    throw error;
  }

}

// ______________________________________________________________________
export async function login(_prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: 'Email does not exist'
      }
    };
  }

  const isvalidPassword = verifyPassword(existingUser.password, password);
  if (!isvalidPassword) {
    return {
      errors: {
        password: 'Password is incorrect'
      }
    };
  }

  // * INFO: Create new session in DB
  await createAuthSession(existingUser.id);
  redirect('/training')
}
