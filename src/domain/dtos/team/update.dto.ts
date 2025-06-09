export class UpdateTeamDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly active: boolean,
        public readonly league: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, UpdateTeamDto?] {
        if (!props || Object.keys(props).length === 0) return ['It is necessary to send the arguments name, active and league for the creation of the team']

        const { id, name, active, league } = props;
        let activeBoolean = active

        if (isNaN(id)) return['The argument team ID must be a number']

        if (name.length > 50) return ['The name must contain a maximum of 50 characters']
        if (!league) return ['The argument league is required']
        if (isNaN(league)) return ['The league must be a number']
        if (league <= 0) return ['The league must be greater than 0']

        switch (typeof active) {
            case 'string':
                activeBoolean = (active.toLowerCase() === 'true' || active === '1') ? true : false
                break;
            case 'number':
                activeBoolean = (active === 1) ? true : false
                break;
        }

        return [undefined, new UpdateTeamDto(id, name, activeBoolean, league)]
    }
}