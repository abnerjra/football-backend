import { UpdateModuleDto } from "../../dtos/module/update.dto";
import { ModuleEntity } from "../../entities/module.entity";
import { ModuleRepository } from "../../repositories/module/module.repository";

export interface UpdateModuleUseCase {
    execute(dto: UpdateModuleDto): Promise<ModuleEntity>
}

export class UpdateModule implements UpdateModuleUseCase {
    constructor(private readonly moduleRepository: ModuleRepository) { }

    async execute(dto: UpdateModuleDto): Promise<ModuleEntity> {
        return this.moduleRepository.update(dto);
    }
}