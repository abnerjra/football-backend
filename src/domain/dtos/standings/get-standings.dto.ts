export class GetStandingsDto {
    constructor(
        public readonly league: number,
        public readonly season: number
    ) { }

    static create(props: { [key: string]: any }): [string?, GetStandingsDto?] {
        if (!props || Object.keys(props).length === 0) return ['League and season parameters are required']

        const { league, season } = props;
        if (league === undefined) return ['League parameter is required']
        if (season === undefined) return ['Season parameter is required']
        
        const parseLeague = Number(league);
        const parseSeason = Number(season);

        if (isNaN(Number(parseLeague))) return ["League must be a number"];
        if (parseLeague < 1) return ["League must be greater than 0"];

        if (isNaN(Number(parseSeason))) return ["Season must be a number"];
        if (parseSeason < 1) return ["Season must be greater than 0"];

        return [undefined, new GetStandingsDto(parseLeague, parseSeason)]
    }
}