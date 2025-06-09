import { prisma } from "../../../data/postgres";
import { MatchDatasource } from "../../../domain/datasource/match/match.datasource";
import { CreateMatchDto } from "../../../domain/dtos/match/create.dto";
import { MatchEntity } from '../../../domain/entities/match.entity';
import { ResponseEntity } from "../../../domain/entities/response.entity";

import messages from "../../../config/handlers/messages/messages";
import { GetMatchesDto } from "../../../domain/dtos/match/get-matches.dto";
import { SimulateMatchDto } from "../../../domain/dtos/match/simulate.dto";

export class MatchDatasourceImpl implements MatchDatasource {
    async getAll(dto: GetMatchesDto): Promise<ResponseEntity> {
        const page = Number(dto.page)
        const limit = Number(dto.limit)
        const skip = (page - 1) * limit;

        const filters: { [key: string]: any } = {};
        if (dto.league) filters.season = { LeagueSeason: { some: { leagueId: Number(dto.league) } } }
        if (dto.season) filters.seasonId = Number(dto.season)
        if (dto.matchday) filters.matchDay = Number(dto.matchday)

        const [total, matches] = await Promise.all([
            await prisma.match.count({ where: filters }),
            await prisma.match.findMany({
                select: {
                    id: true,
                    matchDay: true,
                    homeScore: true,
                    awayScore: true,
                    season: {
                        select: {
                            name: true
                        }
                    },
                    homeTeam: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    awayTeam: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                where: filters,
                skip,
                take: limit
            })
        ])

        const data = matches.map(match => {
            const { season, homeTeam, awayTeam } = match
            const matchday = `Matchday ${match.matchDay}`;
            return MatchEntity.fromJson({ ...match, matchday })
        })

        const paginated = {
            totalRecords: total,
            totalPerPage: data.length,
            totalPages: Math.ceil(total / limit),
            page,
            limit
        }
        return ResponseEntity.fromJson({ ...messages.response.reads, data, paginated });
    }

    async create(dto: CreateMatchDto): Promise<ResponseEntity> {
        const { league, season } = dto

        const activeSeason = await prisma.season.findFirst({ where: { id: season, active: true } })
        if (!activeSeason) return ResponseEntity.fromJson(messages.match.activeSeason)

        const activeLeagueSeason = await prisma.leagueSeason.findFirst({
            where: { leagueId: league, seasonId: season, finished: false },
            select: {
                league: {
                    select: { name: true }
                }
            }
        })
        if (!activeLeagueSeason) return ResponseEntity.fromJson(messages.match.activeLeagueSeason)

        const matchCount = await prisma.match.count({
            where: {
                seasonId: season,
                finished: false,
                OR: [
                    {
                        homeTeam: {
                            leagueId: league,
                        },
                    },
                    {
                        awayTeam: {
                            leagueId: league,
                        },
                    },
                ],
            },
        });
        if (matchCount) return ResponseEntity.fromJson(messages.match.matchCount)

        const teams = await prisma.team.findMany({ where: { leagueId: league, active: true } });
        if (!teams.length) {
            const message = messages.match.withoutTeams({ leagueName: activeLeagueSeason.league.name })
            return ResponseEntity.fromJson(message)
        }
        if (teams.length % 2 !== 0) return ResponseEntity.fromJson(messages.match.oddNumber)

        const teamIds = teams.map(team => team.id)

        const rounds = teamIds.length - 1;
        const half = teamIds.length / 2;
        const maxHome = Math.floor(rounds / 2) + 1;

        const homeCounter: Record<number, number> = {};
        teamIds.forEach(id => homeCounter[id] = 0)

        const list = [...teamIds]
        const schedule: [number, number][][] = [];

        for (let i = 0; i < rounds; i++) {
            const day: [number, number][] = [];
            for (let j = 0; j < half; j++) {
                const a = list[j];
                const b = list[list.length - 1 - j]

                const canAHome = homeCounter[a] < maxHome;
                const canBHome = homeCounter[b] < maxHome;

                let home: number, away: number;
                if (canAHome && canBHome) {
                    if (Math.random() < 0.5) {
                        home = a;
                        away = b;
                    } else {
                        home = b;
                        away = a;
                    }
                } else if (canAHome) {
                    home = a;
                    away = b;
                } else {
                    home = b;
                    away = a;
                }
                homeCounter[home]++;
                day.push([home, away]);
            }

            schedule.push(day);

            const fixed = list[0];
            const rotated = [fixed, ...list.slice(2), list[1]]
            list.splice(0, list.length, ...rotated)
        }

        const secondRound = schedule.map(j => j.map(([h, a]) => [a, h]));
        const allRounds = [...schedule, ...secondRound]

        let matchDay = 1;
        for (const day of allRounds) {
            for (const [homeId, awayId] of day) {
                const matches = {
                    homeTeamId: homeId,
                    awayTeamId: awayId,
                    matchDay,
                    seasonId: season,
                }
                await prisma.match.create({
                    data: matches
                })
            }
            matchDay++;
        }

        const existsStadings = await prisma.standings.count({ where: { leagueId: league, seasonId: season, teamId: { in: teamIds } } })
        if (!existsStadings) {
            for (const team of teams) {
                await prisma.standings.create({ data: { seasonId: season, leagueId: league, teamId: team.id } })
            }
        }

        const message = messages.match.created({ matchDay, season: activeSeason.name, league: activeLeagueSeason.league.name })
        return ResponseEntity.fromJson(message)
    }

    async simulate(dto: SimulateMatchDto): Promise<ResponseEntity> {
        const { league, season, matchday } = dto

        const activeSeason = await prisma.season.findFirst({ where: { id: season, active: true } })
        if (!activeSeason) return ResponseEntity.fromJson(messages.match.activeSeason)

        const activeLeagueSeason = await prisma.leagueSeason.findFirst({
            where: { leagueId: league, seasonId: season, finished: false },
            select: {
                league: {
                    select: { name: true }
                }
            }
        })
        if (!activeLeagueSeason) {
            return this.endSeason(season, league);
            // return ResponseEntity.fromJson(messages.match.activeLeagueSeason)
        }

        const leagueSeason = await prisma.leagueSeason.findFirst({ where: { leagueId: league, seasonId: season } });
        const maxMatchday = await prisma.match.findFirst({
            where: { seasonId: leagueSeason?.seasonId },
            orderBy: { matchDay: "desc" }
        })

        if (matchday > maxMatchday!.matchDay) return ResponseEntity.fromJson(messages.match.invalidMatchday({ matchday, maxMatchday: maxMatchday!.matchDay }))

        const matchFinished = await prisma.match.count({
            where: {
                seasonId: season,
                finished: true,
                matchDay: matchday,
                OR: [
                    {
                        homeTeam: {
                            leagueId: league,
                        },
                    },
                    {
                        awayTeam: {
                            leagueId: league,
                        },
                    },
                ],
            },
        })
        if (matchFinished) {
            if (maxMatchday?.matchDay === matchday) {
                return this.endSeason(season, league);
            }
            return ResponseEntity.fromJson(messages.match.finished({ matchday }))
        }

        const previousMatchday = (matchday == 1) ? matchday : matchday - 1;
        if (matchday !== 1) {
            const previousFinished = await prisma.match.count({ where: { matchDay: previousMatchday, finished: false } })
            if (previousFinished) return ResponseEntity.fromJson(messages.match.matchdayNotFinished({ matchday }))
        }

        const teams = await prisma.team.findMany({ where: { leagueId: league, active: true } });
        if (!teams.length) {
            const message = messages.match.withoutTeams({ leagueName: activeLeagueSeason.league.name })
            return ResponseEntity.fromJson(message)
        }

        const matchDays = await prisma.match.findMany({
            where: {
                matchDay: matchday,
                seasonId: season,
                OR: [
                    {
                        homeTeam: { leagueId: league }
                    },
                    {
                        awayTeam: { leagueId: league }
                    }
                ]
            }
        })

        let matchGames = 0;
        for (const match of matchDays) {
            const homeGoals = Math.floor(Math.random() * 5)
            const awayGoals = Math.floor(Math.random() * 5)

            const homeMatchPoints = (homeGoals == awayGoals) ? 1 : (homeGoals > awayGoals) ? 3 : 0;
            const awayMatchPoints = (homeGoals == awayGoals) ? 1 : (awayGoals > homeGoals) ? 3 : 0;

            const homeStanding = await prisma.standings.findFirst({ where: { teamId: match.homeTeamId } });
            const awayStanding = await prisma.standings.findFirst({ where: { teamId: match.awayTeamId } });

            if (!homeStanding || !awayStanding) continue;

            const homePoints = homeStanding.points + homeMatchPoints;
            const awayPoints = awayStanding.points + awayMatchPoints;

            let winHome = homeStanding.won;
            let drawHome = homeStanding.draw;
            let lostHome = homeStanding.lost;

            let winAway = awayStanding.won;
            let drawAway = awayStanding.draw;
            let lostAway = awayStanding.lost;

            if (homeGoals == awayGoals) {
                drawHome += 1;
                drawAway += 1;
            } else if (homeGoals > awayGoals) {
                winHome += 1;
                lostAway += 1;
            } else {
                winAway += 1;
                lostHome += 1;
            }

            const statsHome = {
                played: homeStanding.played + 1,
                points: homePoints,
                won: winHome,
                draw: drawHome,
                lost: lostHome,
                goalsScored: homeStanding.goalsScored + homeGoals,
                goalsAgainst: homeStanding.goalsAgainst + awayGoals
            };

            const statsAway = {
                played: awayStanding.played + 1,
                points: awayPoints,
                won: winAway,
                draw: drawAway,
                lost: lostAway,
                goalsScored: awayStanding.goalsScored + awayGoals,
                goalsAgainst: awayStanding.goalsAgainst + homeGoals
            }

            await prisma.standings.update({ where: { id: homeStanding.id }, data: statsHome });

            await prisma.standings.update({ where: { id: awayStanding.id }, data: statsAway });

            await prisma.match.update({ where: { id: match.id }, data: { finished: true, homeScore: homeGoals, awayScore: awayGoals } });
            matchGames++;
        }

        return ResponseEntity.fromJson(messages.match.matchdayFinished({ matches: matchGames, matchday }))
    }

    private endSeason = async (season: number, league: number) => {
        const getChampion = await prisma.standings.findFirst({
            select: {
                team: {
                    select: { name: true }
                },
                season: {
                    select: {
                        name: true
                    },
                },
                league: {
                    select: {
                        name: true
                    }
                },
                champion: true,
                goalsScored: true,
                id: true,
                points: true
            },
            where: { leagueId: league, seasonId: season },
            orderBy: [{ points: "desc" }, { goalsScored: "desc" }],
        });

        // update status champion
        if (!getChampion!.champion) {
            await prisma.standings.update({ where: { id: getChampion!.id }, data: { champion: true } })
            // finished season
            await prisma.leagueSeason.update({ where: { leagueId_seasonId: { leagueId: league, seasonId: season } }, data: { finished: true } })
        }

        return ResponseEntity.fromJson(messages.standing.champion({
            season: getChampion!.season.name, league: getChampion!.league.name, team: getChampion!.team.name
        }))
    }
}