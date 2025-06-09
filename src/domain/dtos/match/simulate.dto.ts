export class SimulateMatchDto {
    constructor(
        public readonly league: number,
        public readonly season: number,
        public readonly matchday: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, SimulateMatchDto?] {
        const { league, season, matchday } = props

        if (!league) return ['League is required']
        if (isNaN(league)) return ['League argument must be a number']
        if (league < 1) return ["The league's argument does not belong to a value in the league's catalog"]

        if (!season) return ['Season is required']
        if (isNaN(season)) return ['Season argument must be a number']
        if (season < 1) return ["The season's argument does not belong to a value in the season's catalog"]

        if (!matchday) return ['Matchday is required']
        if (isNaN(matchday)) return ['Matchday argument must be a number']
        if (matchday < 1) return ["The matchday argument must be greater than 0"]

        return [undefined, new SimulateMatchDto(league, season, matchday)]
    }
}