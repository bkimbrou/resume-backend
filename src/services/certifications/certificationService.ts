import {Certification} from '../models/certification';
import {AbstractDynamoService} from '../abstractDynamoService';
import {Service} from '../service';

export class CertificationService extends AbstractDynamoService<Certification> implements Service<Certification> {
    constructor(tableName: string, readLimit: number) {
        super(tableName, readLimit)
    }

    public async readAll(event: any = {}, context: any = {}) : Promise<Array<Certification>> {
        return await this.scanTable();
    }

    public async upsert(event: Certification, context: any = {}) : Promise<void> {
        return await this.putItem(event);
    }

    public async delete(event: any, context: any = {}) : Promise<void> {
        return await this.deleteItem(event);
    }
}