import { regularExpression } from "../../../config";

export class AuthDto {

    private constructor(
        public readonly email: string,
        public readonly password: string
    ) { }

    static create(props: { [key: string]: any }): [string?, AuthDto?] {
        if (!props || typeof props !== 'object') return ['Email and password are required']

        const { email, password } = props;
        if (!email) return ['Email is required']
        if (!regularExpression.email.test(email)) return ['Email is invalid']

        if (!password) return ['Password is required']
        if (password.length < 6) return ['Password to short']

        return [undefined, new AuthDto(email, password)]
    }
}