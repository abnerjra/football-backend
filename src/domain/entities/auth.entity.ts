interface UserHasRoles {
    id: number,
    name: string,
    key: string
}

export class AuthEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly token: string,
        public readonly iat: number,
        public readonly exp: number,
        public readonly roles?: UserHasRoles[]
    ) { }

    static fromObject(obj: { [key: string]: any }): AuthEntity {
        const { id, name, lastName, email, token, iat, exp, roles } = obj
        return new AuthEntity(id, name, lastName, email, token, iat, exp, roles)
    }
}