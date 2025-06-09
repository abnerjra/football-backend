type Team = {
    id: number,
    name: string
}

type Season = {
    id: number,
    name: string
}

export class MatchEntity {
    constructor(
        public readonly id: number,
        public readonly matchday: string,
        public readonly season: Season,
        public readonly homeTeam: Team,
        public readonly awayTeam: Team,
        public readonly homeScore: number,
        public readonly awayScore: number,
        public readonly finished: boolean,
    ) { }

    static fromJson(props: { [key: string]: any }): MatchEntity {
        const { id, matchday, homeScore, awayScore, homeTeam, awayTeam, season, finished } = props;
        return new MatchEntity(id, matchday, season, homeTeam, awayTeam, homeScore, awayScore, finished);
    }
}