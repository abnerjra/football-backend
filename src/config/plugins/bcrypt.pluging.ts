import { compareSync, genSaltSync, hashSync } from "bcryptjs";

interface OptionsCompare {
    password: string;
    hash: string;
}

export class BcryptPlugin {
    static hash = (password: string): string => {
        const salt = genSaltSync(12);
        return hashSync(password, salt);
    }

    static compare = (options: OptionsCompare): boolean => {
        const { password, hash } = options;
        return compareSync(password, hash)
    }
}