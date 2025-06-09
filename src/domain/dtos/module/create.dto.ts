export class CreateModuleDto {
    constructor(
        public readonly name: string,
        public readonly key: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly permissions?: string[],
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateModuleDto?] {
        const { name, key, description, active, permissions } = props;
        let activeBoolean = active

        if (!name) return ['Name is required']
        if (name.length > 100) return ['The name must have a maximum of 100 characters']
        if (!key) return ['Key module is required']
        if (key.length > 10) return ['The key must have a maximum of 10 characters']
        if (!description) return ['Description is required']
        if (description.length > 255) return ['The description must have a maximum of 255 characters']
        if (typeof activeBoolean !== 'boolean') {
            activeBoolean = (active === true)
        }

        if (permissions !== undefined) {
            if (!Array.isArray(permissions)) return ['Permissions must be an array'];
            // if (permissions.length === 0) return ['It is necessary to send at least one permission'];

            const invalid = permissions.some(
                p => typeof p !== 'string' || p.trim() === ''
            );
            if (invalid) return ['Each permission must be a non-empty string'];
        }

        return [undefined, new CreateModuleDto(name, key, description, activeBoolean, permissions)]
    }
}