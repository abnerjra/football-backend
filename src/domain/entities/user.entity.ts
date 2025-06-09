interface UserHasRoles {
    id: number,
    name: string
}

export class UserEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly acronym: string,
        public readonly active: boolean,
        public readonly roles?: UserHasRoles[]
    ) { }

    static fromObject(props: { [key: string]: any }): UserEntity {
        const { id, name, lastName, email, acronym, active, roles } = props
        return new UserEntity(id, name, lastName, email, acronym, active, roles)
    }
}