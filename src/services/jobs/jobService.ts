import {Job} from "../models/job";
import {AbstractDynamoService} from "../abstractDynamoService";

export class JobService extends AbstractDynamoService<Job>{
    constructor() {
        super('resume-certifications', 50)
    }

    public readAll(event: any, context: any) : Promise<Array<Job>> {
        return new Promise<Array<Job>>(this.scanTable);
    }

    public upsert(event: Job, context: any) : Promise<void> {
        return new Promise<void>(() => this.putItem(event));
    }

    public delete(event: any, context: any) : Promise<void> {
        return new Promise<void>(() => this.deleteItem(event));
    }
}