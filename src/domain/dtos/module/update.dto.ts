export class UpdateModuleDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly permissions?: string[],
    ) { }

    static create(props: { [key: string]: any }): [string?, UpdateModuleDto?] {
        const { id, name, description, active, permissions } = props;
        let activeBoolean = active

        if (!name) return ['Name is required']
        if (name.length > 100) return ['The name must have a maximum of 100 characters']
        if (!description) return ['Description is required']
        if (description.length > 255) return ['The description must have a maximum of 255 characters']
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

        if (permissions !== undefined) {
            if (!Array.isArray(permissions)) return ['Permissions must be an array'];
            // if (permissions.length === 0) return ['It is necessary to send at least one permission'];

            const invalid = permissions.some(
                p => typeof p !== 'string' || p.trim() === ''
            );
            if (invalid) return ['Each permission must be a non-empty string'];
        }

        return [undefined, new UpdateModuleDto(id, name, description, activeBoolean, permissions)]
    }
}