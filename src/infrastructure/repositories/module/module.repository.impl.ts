import { ModuleDatasource } from "../../../domain/datasource/module/module.datasource";
import { CreateModuleDto } from "../../../domain/dtos/module/create.dto";
import { UpdateModuleDto } from "../../../domain/dtos/module/update.dto";
import { ModuleEntity } from "../../../domain/entities/module.entity";
import { ModuleRepository } from "../../../domain/repositories/module/module.repository";

export class ModuleRepositoryImpl implements ModuleRepository {
    constructor(private readonly datasource: ModuleDatasource) { }

    getAll(): Promise<ModuleEntity[]> {
        return this.datasource.getAll()
    }

    getById(id: number): Promise<ModuleEntity> {
        return this.datasource.getById(id)
    }

    create(createModuleDto: CreateModuleDto): Promise<ModuleEntity> {
        return this.datasource.create(createModuleDto)
    }

    update(updateModuleDto: UpdateModuleDto): Promise<ModuleEntity> {
        return this.datasource.update(updateModuleDto)
    }

}