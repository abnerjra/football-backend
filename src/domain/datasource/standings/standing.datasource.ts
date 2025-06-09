import { GetStandingsDto } from "../../dtos/standings/get-standings.dto";
import { ResponseEntity } from "../../entities/response.entity";

export abstract class StandingDatasource {
    abstract getStandings(dto: GetStandingsDto): Promise<ResponseEntity>
}