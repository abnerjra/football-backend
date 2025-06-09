export class GetTeamsDto {
    constructor(
        public readonly name: string,
        public readonly active: boolean,
        public readonly league: number,
        public readonly page: number,
        public readonly limit: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, GetTeamsDto?] {
        const { name, active, league, page, limit } = props;
        let activeBoolean = active

        if (league === undefined) return ['League parameter is required']
        const parseLeague = Number(league);
        if (isNaN(Number(parseLeague))) return ["League must be a number"];
        if (parseLeague < 1) return ["League must be greater than 0"];

        switch (typeof active) {
            case 'string':
                activeBoolean = (active.toLowerCase() === 'true' || active === '1') ? true : false
                break;
            case 'number':
                activeBoolean = (active === 1) ? true : false
                break;

            default:
                activeBoolean = true
                break;
        }

        let parsePage = page;
        if (!parsePage) parsePage = 1
        let parseLimit = limit;
        if (!parseLimit) parseLimit = 10

        return [undefined, new GetTeamsDto(name, activeBoolean, parseLeague, parsePage, parseLimit)]
    }
}