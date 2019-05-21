import {Skill} from "../models/skill";
import {AbstractDynamoService} from "../abstractDynamoService";

export class SkillService extends AbstractDynamoService<Skill>{
    constructor() {
        super('resume-certifications', 50)
    }

    public readAll(event: any, context: any) : Promise<Array<Skill>> {
        return new Promise<Array<Skill>>(this.scanTable);
    }

    public upsert(event: Skill, context: any) : Promise<void> {
        return new Promise<void>(() => this.putItem(event));
    }

    public delete(event: any, context: any) : Promise<void> {
        return new Promise<void>(() => this.deleteItem(event));
    }
}