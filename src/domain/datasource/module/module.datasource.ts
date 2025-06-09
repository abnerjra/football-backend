import { CreateModuleDto } from "../../dtos/module/create.dto";
import { UpdateModuleDto } from "../../dtos/module/update.dto";
import { ModuleEntity } from "../../entities/module.entity";

export abstract class ModuleDatasource {
    abstract getAll(): Promise<ModuleEntity[]>

    abstract getById(id: number): Promise<ModuleEntity>

    abstract create(createModuleDto: CreateModuleDto): Promise<ModuleEntity>

    abstract update(updateModuleDto: UpdateModuleDto): Promise<ModuleEntity>
}