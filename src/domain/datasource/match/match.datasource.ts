import { CreateMatchDto } from "../../dtos/match/create.dto";
import { GetMatchesDto } from "../../dtos/match/get-matches.dto";
import { SimulateMatchDto } from "../../dtos/match/simulate.dto";
import { MatchEntity } from "../../entities/match.entity";
import { ResponseEntity } from "../../entities/response.entity";

export abstract class MatchDatasource {

    abstract getAll(dto: GetMatchesDto): Promise<ResponseEntity>

    abstract create(dto: CreateMatchDto): Promise<ResponseEntity>

    abstract simulate(dto: SimulateMatchDto): Promise<ResponseEntity>
}