import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { badRequestError, unauthorizedError } from '../errors/http-error.js';

const SALT_ROUNDS = 12;

export interface Credentials {
  username: string;
  password: string;
}

export async function register({ username, password }: Credentials): Promise<User> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ username, password: hash });
    return newUser;
}

export async function login({ username, password }: Credentials): Promise<User> {
    const user = await User.findOne({ where: { username } });
    if (!user) throw unauthorizedError("Nom d'utilisateur ou mot de passe incorrect.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw unauthorizedError("Nom d'utilisateur ou mot de passe incorrect.");

    return user;
}