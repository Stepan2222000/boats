import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { RegisterUser, LoginUser, PublicUser } from "@shared/schema";

const SALT_ROUNDS = 10;

export async function registerUser(data: RegisterUser): Promise<PublicUser> {
  const existingUser = await storage.getUserByPhone(data.phone);
  if (existingUser) {
    throw new Error("Пользователь с таким номером телефона уже существует");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await storage.createUser({
    phone: data.phone,
    passwordHash,
  });

  return user;
}

export async function loginUser(data: LoginUser): Promise<PublicUser> {
  const user = await storage.getUserByPhone(data.phone);
  if (!user) {
    throw new Error("Неверный номер телефона или пароль");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Неверный номер телефона или пароль");
  }

  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
