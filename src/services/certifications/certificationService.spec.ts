import {CertificationService} from './certificationService';
import {Certification} from '../models/certification';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import {expect} from 'chai';
import {mochaAsync} from '../../mochaHelper';
import 'mocha';
import {PutItemInput, ScanInput} from 'aws-sdk/clients/dynamodb';
import uuid = require('uuid');

describe('Certification Service Tests', () => {
    let service: CertificationService;

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

    it('Can create/update an item', mochaAsync(async () => {
        AWSMock.mock('DynamoDB', 'putItem', (params: PutItemInput, callback: Function) => {
            console.log('DynamoDB', 'putItem', 'mock called');
            callback(null, {});
        });

        const certification: Certification = generateCertification(false);

        await service.upsert(certification); //upsert was successfully called and resolved successfully
    }));

    it('Can delete an item', mochaAsync(async () => {
        AWSMock.mock('DynamoDB', 'deleteItem', (params: PutItemInput, callback: Function) => {
            console.log('DynamoDB', 'deleteItem', 'mock called');
            callback(null, {});
        });

        await service.delete({id: uuid()});
    }));

    it('Can get zero items', mochaAsync(async () => {
        AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
            console.log('DynamoDB', 'scan', 'mock called');
            callback(null, {
                ScannedCount: 0,
                Items: [],
            });
        });

        let res: Array<Certification> = await service.readAll();
        expect(res).not.undefined;
        expect(res.length).to.eql(0);
    }));

    it('Can get one item', mochaAsync(async () => {
        const cert1: Certification = generateCertification();

        AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
            console.log('DynamoDB', 'scan', 'mock called');
            callback(null, {
                ScannedCount: 1,
                Items: [CertificationService.jsonToItem(cert1)],
            });
        });

        let res: Array<Certification> = await service.readAll();
        expect(res).not.undefined;
        expect(res.length).to.eql(1);
        expect(res[0].id).to.eql(cert1.id);
        expect(res[0].name).to.eql(cert1.name);
        expect(res[0].dateIssued).to.eql(cert1.dateIssued);
        expect(res[0].dateExpires).to.eql(cert1.dateExpires);
        expect(res[0].image).to.eql(cert1.image);
    }));

    it('Can get many items', mochaAsync(async () => {
        const cert1: Certification = generateCertification();

        const cert2: Certification = generateCertification();

        const cert3: Certification = generateCertification();

        AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
            console.log('DynamoDB', 'scan', 'mock called');
            callback(null, {
                ScannedCount: 3,
                Items: [CertificationService.jsonToItem(cert1), CertificationService.jsonToItem(cert2), CertificationService.jsonToItem(cert3)],
            });
        });

        let res: Array<Certification> = await service.readAll();
        expect(res).not.undefined;
        expect(res.length).to.eql(3);
        expect(res[0].id).to.eql(cert1.id);
        expect(res[0].name).to.eql(cert1.name);
        expect(res[0].dateIssued).to.eql(cert1.dateIssued);
        expect(res[0].dateExpires).to.eql(cert1.dateExpires);
        expect(res[0].image).to.eql(cert1.image);

        expect(res[1].id).to.eql(cert2.id);
        expect(res[1].name).to.eql(cert2.name);
        expect(res[1].dateIssued).to.eql(cert2.dateIssued);
        expect(res[1].dateExpires).to.eql(cert2.dateExpires);
        expect(res[1].image).to.eql(cert2.image);

        expect(res[2].id).to.eql(cert3.id);
        expect(res[2].name).to.eql(cert3.name);
        expect(res[2].dateIssued).to.eql(cert3.dateIssued);
        expect(res[2].dateExpires).to.eql(cert3.dateExpires);
        expect(res[2].image).to.eql(cert3.image);
    }));
});

const generateCertification = function (withId: boolean = true) : Certification {
    let result: Certification = {
        name: (Math.random() + 1).toString(36).substring(Math.random() + 1),
        description: (Math.random() + 1).toString(36).substring(Math.random() + 1),
        dateIssued: new Date(Math.floor(Math.random() * 2019) + 2000, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1),
        dateExpires: new Date(Math.floor(Math.random() * 2019) + 2001, Math.floor(Math.random() * 12) + 1, Math.floor(Math.random() * 28) + 1),
        image: (Math.random() + 1).toString(36).substring(Math.random() + 1)
    };

    if (withId) {
        result.id = uuid();
    }

    return result;
};