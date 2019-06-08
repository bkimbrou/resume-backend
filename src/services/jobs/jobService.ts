import {Job} from '../models/job';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';
import {Certification} from '../models/certification';
import {Education} from '../models/education';

export class JobService extends AbstractDynamoService<Job> implements Service<Job> {
    constructor(tableName: string, readLimit: number) {
        super(tableName, readLimit)
    }

    public async readAll(event: any = {}, context: any = {}) : Promise<Array<Job>> {
        return await this.scanTable();
    }

    public async upsert(event: Job, context: any = {}) : Promise<void> {
        return await this.putItem(event);
    }

    public async delete(event: any, context: any = {}) : Promise<void> {
        return await this.deleteItem(event);
    }
}