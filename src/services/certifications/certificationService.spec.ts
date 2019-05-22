import {CertificationService} from "./certificationService";
import {Certification} from "../models/certification";
import {expect} from 'chai';
import 'mocha';
import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'

describe('Certification Service Tests', () => {
    let service: CertificationService;
    const certification: Certification = {
        name: "Sample Cert",
        description: "A dummy certification",
        dateIssued: new Date(2019, 5, 13),
        dateExpires: new Date(20122, 5, 13)
    };

    beforeEach(() => {
        service = new CertificationService();
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('DynamoDB', 'putItem', (params: any, callback: (err: any, data: any) => void) => console.log('replacing Dynamo PutItem call'));
    });

    afterEach(() => {
        AWSMock.restore()
    });

    it('Can create an item', () => {
        service.upsert(certification).catch(reason => {
            expect.fail(null, null, reason)
        }).then(() => expect(true).to.be.true);
    });
});