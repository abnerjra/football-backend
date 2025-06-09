type League = {
    id: number,
    name: string
}
export class TeamEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly active: boolean,
        public readonly league: League,
    ) { }

    static fromJson(props: { [key: string]: any }): TeamEntity {
        const { id, name, active, league } = props

        return new TeamEntity(id, name, active, league)
    }
}