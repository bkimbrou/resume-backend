import {Education} from "../models/education";
import {AbstractDynamoService} from "../abstractDynamoService";

export class EducationService extends AbstractDynamoService<Education>{
    constructor() {
        super('resume-certifications', 10)
    }

    public readAll(event: any, context: any) : Promise<Array<Education>> {
        return new Promise<Array<Education>>(this.scanTable);
    }

    public upsert(event: Education, context: any) : Promise<void> {
        return new Promise<void>(() => this.putItem(event));
    }

    public delete(event: any, context: any) : Promise<void> {
        return new Promise<void>(() => this.deleteItem(event));
    }
}