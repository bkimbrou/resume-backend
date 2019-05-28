import {CertificationService} from './certificationService';
import {Certification} from '../models/certification';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import {expect} from 'chai';
import {mochaAsync} from '../../mochaHelper';
import 'mocha';
import {PutItemInput} from 'aws-sdk/clients/dynamodb';

describe('Certification Service Tests', () => {
    let service: CertificationService;
    const certification: Certification = {
        name: 'Sample Cert',
        description: 'A dummy certification',
        dateIssued: new Date(2019, 5, 13),
        dateExpires: new Date(2022, 5, 13),
        image: 'https://dummycert.com/sample'
    };

    before(async (done) => {
        AWSMock.setSDKInstance(AWS);
        done();
    });

    beforeEach(async (done) => {
        service = new CertificationService();
        done()
    });

    afterEach(async (done) => {
        AWSMock.restore();
        done();
    });

    it('Can create an item', mochaAsync(async () => {
        AWSMock.mock('DynamoDB', 'putItem', (params: PutItemInput, callback: Function) => {
            console.log('DynamoDB', 'putItem', 'mock called');
            callback(null, {
                Attributes: params.Item,
                ConsumedCapacity: {
                    WriteCapacityUnits: 1,
                    ReadCapacityUnits: 0
                }
            });
        });

        let res: Certification = await service.upsert(certification);
        expect(res).not.undefined;
        expect(res.id).not.empty;
        expect(res.name).to.eql(certification.name);
        expect(res.description).to.eql(certification.description);
        expect(res.dateIssued).to.eql(certification.dateIssued);
        expect(res.dateExpires).to.eql(certification.dateExpires);
        expect(res.image).to.eql(certification.image);
    }));
});