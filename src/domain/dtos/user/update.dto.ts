export class UpdateUserDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly acronym: string,
        public readonly active: boolean,
        public readonly roles: number[]
    ) { }

    static create(props: { [key: string]: any }): [string?, UpdateUserDto?] {
        const { id, name, lastName, email, password, acronym, active, roles } = props;
        let activeBoolean = active

        if (!id) return ['User ID is required']
        if (!name) return ['Name is required']
        if (!lastName) return ['lastName is required']
        if (!email) return ['Email is required']
        if (!password) return ['Password is required']
        if (password.length < 6) return ['Password to short']
        if (!acronym) return ['Acronym is required']
        if (typeof activeBoolean !== 'boolean') {
            console.log(typeof activeBoolean)
            // activeBoolean = (active.toLowerCase() === 'true' || active === '1') ? true : false;
            switch (typeof activeBoolean) {
                case 'string':
                    activeBoolean = active.toLowerCase() === 'true' ? true : false;
                    break;
                case 'number':
                    activeBoolean = active === 1 ? true : false;
                    break;
            }
        }
        if (!roles) return ['Roles is required']
        if (!Array.isArray(roles)) return ['Roles must be an array'];
        if (!roles.length) return ['It is necessary to send at least one role']
        if (!roles.every(r => typeof r === 'number' && Number.isFinite(r))) {
            return ['All roles must be valid numbers'];
        }

        return [undefined, new UpdateUserDto(id, name, lastName, email, password, acronym, activeBoolean, roles)]
    }
}