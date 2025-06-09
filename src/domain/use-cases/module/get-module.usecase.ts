import { ModuleEntity } from "../../entities/module.entity";
import { ModuleRepository } from "../../repositories/module/module.repository";

export interface GetModuleUseCase {
    execute(id: number): Promise<ModuleEntity>
}

export class GetModule implements GetModuleUseCase {
    constructor(private readonly moduleRepository: ModuleRepository) { }

    async execute(id: number): Promise<ModuleEntity> {
        return this.moduleRepository.getById(id);
    }
}