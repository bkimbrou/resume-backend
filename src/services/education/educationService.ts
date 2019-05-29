import {Education} from '../models/education';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';
import {Certification} from '../models/certification';

export class EducationService extends AbstractDynamoService<Education> implements Service<Education> {
    constructor() {
        super('resume-education', 10)
    }

    public async readAll(event: any = {}, context: any = {}) : Promise<Array<Education>> {
        return await this.scanTable();
    }

    public async upsert(event: Education, context: any = {}) : Promise<void> {
        return await this.putItem(event);
    }

    public async delete(event: any, context: any = {}) : Promise<void> {
        return await this.deleteItem(event);
    }
}