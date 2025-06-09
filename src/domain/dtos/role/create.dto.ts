import { regularExpression } from "../../../config"

interface Permission {
    module: string,
    permissions: string[]
}

export class CreateRoleDto {
    constructor(
        public readonly name: string,
        public readonly key: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly modules: Permission[],
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateRoleDto?] {
        // console.log(props)
        const { name, key, description, active, modules } = props
        let activeBoolean = active

        if (!name) return ['Role name is required']
        if (name.length > 30) return ['The name must contain a maximum of 30 characters']
        if (!key) return ['Key role is required']
        if (!regularExpression.withoutSpaces.test(key)) return ['The key must not contain spaces']
        if (!description) return ['Role description is required']
        if (typeof activeBoolean !== 'boolean') {
            activeBoolean = (active === true)
        }
        if (!modules) return ['Permissions is required']
        if (!Array.isArray(modules)) return ['Permissions must be an array'];
        if (!modules.length) return ['It is necessary to send at least one permission']

        return [undefined, new CreateRoleDto(name, key, description, activeBoolean, modules)]
    }
}