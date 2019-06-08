import {Skill} from '../models/skill';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';
import {Education} from '../models/education';

export class SkillService extends AbstractDynamoService<Skill> implements Service<Skill> {
    constructor(tableName: string, readLimit: number) {
        super(tableName, readLimit)
    }

    public async readAll(event: any = {}, context: any = {}) : Promise<Array<Skill>> {
        return await this.scanTable();
    }

    public async upsert(event: Skill, context: any = {}) : Promise<void> {
        return await this.putItem(event);
    }

    public async delete(event: any, context: any = {}) : Promise<void> {
        return await this.deleteItem(event);
    }
}