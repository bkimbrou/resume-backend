import {Certification} from "../models/certification";
import {AbstractDynamoService} from "../abstractDynamoService";

export class CertificationService extends AbstractDynamoService<Certification>{
    constructor() {
        super('resume-certifications', 50)
    }

    public readAll(event: any = {}, context: any = {}) : Promise<Array<Certification>> {
        return new Promise<Array<Certification>>(this.scanTable);
    }

    public upsert(event: Certification, context: any = {}) : Promise<void> {
        return new Promise<void>(() => this.putItem(event));
    }

    public delete(event: any, context: any = {}) : Promise<void> {
        return new Promise<void>(() => this.deleteItem(event));
    }
}