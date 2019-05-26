import {CertificationService} from './certificationService';
import {Certification} from '../models/certification';
import AWSMock from 'aws-sdk-mock'
import {v4 as uuid} from 'uuid';
import {expect} from 'chai';
import {mochaAsync} from '../../mochaHelper';
import 'mocha';

describe('Certification Service Tests', () => {
    let service: CertificationService;
    const certification: Certification = {
        name: 'Sample Cert',
        description: 'A dummy certification',
        dateIssued: new Date(2019, 5, 13),
        dateExpires: new Date(2022, 5, 13),
        image: 'https://dummycert.com/sample'
    };

    beforeEach(() => {
        service = new CertificationService();
    });

    afterEach(() => {
        AWSMock.restore()
    });

    it('Can create an item', mochaAsync(async () => {
        AWSMock.mock('DynamoDB', 'putItem', (params: Certification, callback: any) => {
            console.log('Returning certification content from mock');
            let temp: Certification = Object.create(certification);
            temp.id = uuid();
            return callback(null, temp);
        });

        let res: Certification = await service.upsert(certification);
        expect(res.id).empty.false;
        expect(res.name).to.eql(certification.name);
        expect(res.description).to.not.eql(certification.description);
        expect(res.dateIssued).to.eql(certification.dateIssued);
        expect(res.dateExpires).to.eql(certification.dateExpires);
        expect(res.image).to.eql(certification.image);
    }));
});