import {Job} from '../models/job';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';
import {Certification} from '../models/certification';

export class JobService extends AbstractDynamoService<Job> implements Service<Job> {
    constructor() {
        super('resume-certifications', 50)
    }

    public readAll(event: any, context: any) : Promise<Array<Job>> {
        return new Promise<Array<Job>>(this.scanTable);
    }

    public upsert(event: Job, context: any) : Promise<Job> {
        return new Promise<Job>(() => this.putItem(event));
    }

    public delete(event: any, context: any) : Promise<any> {
        return new Promise<any>(() => this.deleteItem(event));
    }
}