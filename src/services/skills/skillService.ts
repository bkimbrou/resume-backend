import {Skill} from '../models/skill';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';

export class SkillService extends AbstractDynamoService<Skill> implements Service<Skill> {
    constructor() {
        super('resume-certifications', 50)
    }

    public readAll(event: any, context: any) : Promise<Array<Skill>> {
        return new Promise<Array<Skill>>(this.scanTable);
    }

    public upsert(event: Skill, context: any) : Promise<Skill> {
        return new Promise<Skill>(() => this.putItem(event));
    }

    public delete(event: any, context: any) : Promise<any> {
        return new Promise<any>(() => this.deleteItem(event));
    }
}