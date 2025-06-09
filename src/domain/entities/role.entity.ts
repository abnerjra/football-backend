interface PermissionsHasRole {
    id: number,
    name: string
}

export class RoleEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly permissions?: PermissionsHasRole[],
    ) { }

    static fromObject(props: { [key: string]: any }): RoleEntity {
        const { id, name, description, active, permissions = [] } = props;
        return new RoleEntity(id, name, description, active, permissions)
    }
}