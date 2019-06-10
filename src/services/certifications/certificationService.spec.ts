import {CertificationService} from './certificationService';
import {Certification} from '../models/certification';
import AWS, {AWSError, DynamoDB} from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import {expect} from 'chai';
import {mochaAsync, randomNumber} from '../../mochaHelper';
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
        service = new CertificationService('dummy_table', 50);
        done()
    });

    afterEach(async (done) => {
        AWSMock.restore();
        done();
    });

    describe("Happy path flows", () => {
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
            expect(res).is.not.undefined;
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
            expect(res).is.not.undefined;
            expect(res.length).to.eql(1);
            expect(res[0].id).to.eql(cert1.id);
            expect(res[0].name).to.eql(cert1.name);
            expect(res[0].dateIssued).to.eql(cert1.dateIssued);
            expect(res[0].dateExpires).to.eql(cert1.dateExpires);
            expect(res[0].image).to.eql(cert1.image);
        }));

        it('Can get three items', mochaAsync(async () => {
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

        it('Can get many items', mochaAsync(async () => {
            let itemList: DynamoDB.ItemList = [];

            for (let i = 0; i < randomNumber(1000, 100); i++) { //create anywhere from 100 to 1000
                itemList.push(CertificationService.jsonToItem(generateCertification()));
            }

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: itemList.length,
                    Items: itemList,
                });
            });

            let res: Array<Certification> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(itemList.length);
        }));
    });

    describe("Bad path flows", () => {
        it("Cannot delete an item without an id", mochaAsync(async () => {
            //Mock should not be necessary, but leaving as a safe guard to prevent real API calls
            AWSMock.mock('DynamoDB', 'deleteItem', (params: PutItemInput, callback: Function) => {
                console.log('DynamoDB', 'deleteItem', 'mock called');
                callback(null, {});
            });

            await service.delete({})
                .then(() => expect.fail(null, null, "Delete should have failed if no id was provided"))
                .catch(reason => expect(reason).to.eql('must have an id to delete'));
        }));

        it("Got an error on delete", mochaAsync(async () => {
            const err: AWSError = {
                code: randomNumber(8).toString(36),
                statusCode: 400,
                name: 'ResourceNotFoundException',
                message: 'Requested resource was not found',
                region: 'us-east-1',
                retryable: false,
                retryDelay: 0,
                time: new Date(),
                hostname: randomNumber(15).toString(36),
                requestId: uuid(),
                extendedRequestId: randomNumber(15).toString(36),
                cfId: randomNumber(15).toString(36)
            };

            AWSMock.mock('DynamoDB', 'deleteItem', (params: PutItemInput, callback: Function) => {
                console.log('DynamoDB', 'deleteItem', 'mock called');
                callback(err, null);
            });

            await service.delete({id: uuid()})
                .then(() => expect.fail(null, null, "Delete should have failed when an error was returned from SDK"))
                .catch(reason => expect(reason).to.eql(err.message));
        }));

        it("Got an error on read", mochaAsync(async () => {
            const err: AWSError = {
                code: randomNumber(8).toString(36),
                statusCode: 400,
                name: 'ResourceNotFoundException',
                message: 'Requested resource was not found',
                region: 'us-east-1',
                retryable: false,
                retryDelay: 0,
                time: new Date(),
                hostname: randomNumber(15).toString(36),
                requestId: uuid(),
                extendedRequestId: randomNumber(15).toString(36),
                cfId: randomNumber(15).toString(36)
            };

            AWSMock.mock('DynamoDB', 'scan', (params: PutItemInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(err, null);
            });

            await service.readAll()
                .then(() => expect.fail(null, null, "Read all should have failed when an error was returned from SDK"))
                .catch(reason => expect(reason).to.eql(err.message));
        }));

        it("Got an error on put", mochaAsync(async () => {
            const err: AWSError = {
                code: randomNumber(8).toString(36),
                statusCode: 400,
                name: 'ResourceNotFoundException',
                message: 'Requested resource was not found',
                region: 'us-east-1',
                retryable: false,
                retryDelay: 0,
                time: new Date(),
                hostname: randomNumber(15).toString(36),
                requestId: uuid(),
                extendedRequestId: randomNumber(15).toString(36),
                cfId: randomNumber(15).toString(36)
            };

            AWSMock.mock('DynamoDB', 'putItem', (params: PutItemInput, callback: Function) => {
                console.log('DynamoDB', 'putItem', 'mock called');
                callback(err, null);
            });

            await service.upsert(generateCertification())
                .then(() => expect.fail(null, null, "Upsert should have failed when an error was returned from SDK"))
                .catch(reason => expect(reason).to.eql(err.message));
        }));
    });
});

export const generateCertification = function (withId: boolean = true) : Certification {
    let result: Certification = {
        name: randomNumber(50).toString(36),
        description: randomNumber(200, 20).toString(36),
        dateIssued: new Date(randomNumber(2010, 2000), randomNumber(12), randomNumber(28)),
        dateExpires: new Date(randomNumber(2020, 2010), randomNumber(12), randomNumber(28)),
        image: randomNumber(50).toString(36)
    };

    if (withId) {
        result.id = uuid();
    }

    return result;
};