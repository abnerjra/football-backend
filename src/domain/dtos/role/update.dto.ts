interface Permission {
    module: string,
    permissions: string[]
}

export class UpdateRoleDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly modules: Permission[],
    ) { }

    static create(props: { [key: string]: any }): [string?, UpdateRoleDto?] {
        const { id, name, description, active, modules } = props
        let activeBoolean = active

        if (!name) return ['Role name is required']
        if (!description) return ['Role description is required']
        if (typeof activeBoolean !== 'boolean') {
            switch (typeof activeBoolean) {
                case 'string':
                    activeBoolean = active.toLowerCase() === 'true' ? true : false;
                    break;
                case 'number':
                    activeBoolean = active === 1 ? true : false;
                    break;
            }
        }
        if (!modules) return ['Permissions is required']
        if (!Array.isArray(modules)) return ['Permissions must be an array'];
        if (!modules.length) return ['It is necessary to send at least one permission']

        return [undefined, new UpdateRoleDto(id, name, description, activeBoolean, modules)]
    }
}