export class GetMatchesDto {
    private constructor(
        public readonly page: number,
        public readonly limit: number,
        public readonly league?: number,
        public readonly season?: number,
        public readonly matchday?: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, GetMatchesDto?] {
        const { league, season, page, limit, matchday } = props;
        if (isNaN(Number(page)) || isNaN(Number(limit))) return ["Page and Limit must be a numbers"];

        if (league !== undefined) {
            if (isNaN(Number(league))) return ["League must be a number"];
            if (league < 1) return ["League must be greater than 0"];
        }

        if (season !== undefined) {
            if (isNaN(Number(season))) return ["Season must be a number"];
            if (season < 1) return ["Season must be greater than 0"];
        }

        if (matchday !== undefined) {
            if (isNaN(Number(matchday))) return ["Matchday must be a number"];
            if (matchday < 1) return ["Matchday must be greater than 0"];
        }

        return [undefined, new GetMatchesDto(page, limit, league, season, matchday)];
    }
}
