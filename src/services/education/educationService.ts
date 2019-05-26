import {Education} from '../models/education';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';

export class EducationService extends AbstractDynamoService<Education> implements Service<Education> {
    constructor() {
        super('resume-certifications', 10)
    }

    public readAll(event: any, context: any) : Promise<Array<Education>> {
        return new Promise<Array<Education>>(this.scanTable);
    }

    public upsert(event: Education, context: any) : Promise<Education> {
        return new Promise<Education>(() => this.putItem(event));
    }

    public delete(event: any, context: any) : Promise<any> {
        return new Promise<any>(() => this.deleteItem(event));
    }
}