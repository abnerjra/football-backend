export class StandingEntity {
    constructor(
        public readonly id: number,
        public readonly position: number,
        public readonly team: string,
        public readonly champion: boolean,
        public readonly played: number,
        public readonly points: number,
        public readonly won: number,
        public readonly draw: number,
        public readonly lost: number,
        public readonly goalsScored: number,
        public readonly goalsAgainst: number
    ) { }

    static fromJson(props: { [key: string]: any }): StandingEntity {
        const { id, position, team, champion, played, points, won, draw, lost, goalsScored, goalsAgainst } = props;

        return new StandingEntity(id, position, team, champion, played, points, won, draw, lost, goalsScored, goalsAgainst);
    }
}