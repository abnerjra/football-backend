import { CreateModuleDto } from "../../dtos/module/create.dto";
import { ModuleEntity } from "../../entities/module.entity";
import { ModuleRepository } from "../../repositories/module/module.repository";

export interface CreateModuleUseCase {
    execute(dto: CreateModuleDto): Promise<ModuleEntity>
}

export class CreateModule implements CreateModuleUseCase {
    constructor(private readonly moduleRepository: ModuleRepository) { }

    async execute(dto: CreateModuleDto): Promise<ModuleEntity> {
        return this.moduleRepository.create(dto);
    }
}