import {Certification} from '../models/certification';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';

export class CertificationService extends AbstractDynamoService<Certification> implements Service<Certification> {
    constructor() {
        super('resume-certifications', 50)
    }

    public readAll(event: any = {}, context: any = {}) : Promise<Array<Certification>> {
        return new Promise<Array<Certification>>(this.scanTable);
    }

    public upsert(event: Certification, context: any = {}) : Promise<Certification> {
        return new Promise<Certification>(() => this.putItem(event));
    }

    public delete(event: any, context: any = {}) : Promise<any> {
        return new Promise<any>(() => this.deleteItem(event));
    }
}