// hashPassword.ts
import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
    const salt_rounds = parseInt(process.env.SALT_ROUNDS || "10");
    const salt = await bcrypt.genSalt(salt_rounds);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
