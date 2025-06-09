import { ModuleEntity } from "../../entities/module.entity";
import { ModuleRepository } from "../../repositories/module/module.repository";

export interface GetModulesUseCase {
    execute(): Promise<ModuleEntity[]>
}

export class GetModules implements GetModulesUseCase {
    constructor(private readonly moduleRepository: ModuleRepository) { }

    async execute(): Promise<ModuleEntity[]> {
        return this.moduleRepository.getAll();
    }
}