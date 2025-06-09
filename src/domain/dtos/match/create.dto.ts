export class CreateMatchDto {
    constructor(
        public readonly league: number,
        public readonly season: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, CreateMatchDto?] {
        const { league, season } = props

        if (!league) return ['League is required']
        if (isNaN(league)) return ['League argument must be a number']
        if (league < 1) return ["The league's argument does not belong to a value in the league's catalog"]

        if (!season) return ['Season is required']
        if (isNaN(season)) return ['Season argument must be a number']
        if (season < 1) return ["The season's argument does not belong to a value in the season's catalog"]

        return [undefined, new CreateMatchDto(league, season)]
    }
}