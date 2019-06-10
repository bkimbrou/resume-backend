import {EducationService} from './educationService';
import {Education} from '../models/education';
import AWS, {AWSError, DynamoDB} from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import {expect} from 'chai';
import {mochaAsync, randomNumber} from '../../mochaHelper';
import 'mocha';
import {PutItemInput, ScanInput} from 'aws-sdk/clients/dynamodb';
import uuid = require('uuid');

describe('Education Service Tests', () => {
    let service: EducationService;

    before(async (done) => {
        AWSMock.setSDKInstance(AWS);
        done();
    });

    beforeEach(async (done) => {
        service = new EducationService('dummy_table', 50);
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

            const education: Education = generateEducation(false);

            await service.upsert(education); //upsert was successfully called and resolved successfully
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

            let res: Array<Education> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(0);
        }));

        it('Can get one item', mochaAsync(async () => {
            const edu1: Education = generateEducation();

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: 1,
                    Items: [EducationService.jsonToItem(edu1)],
                });
            });

            let res: Array<Education> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(1);
            expect(res[0].id).to.eql(edu1.id);
            expect(res[0].school).to.eql(edu1.school);
            expect(res[0].degree).to.eql(edu1.degree);
            expect(res[0].graduationDate).to.eql(edu1.graduationDate);
            expect(res[0].location).to.eql(edu1.location);
            expect(res[0].isCurrentlyAttending).to.eql(edu1.isCurrentlyAttending);
        }));

        it('Can get three items', mochaAsync(async () => {
            const edu1: Education = generateEducation();

            const edu2: Education = generateEducation();

            const edu3: Education = generateEducation();

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: 3,
                    Items: [EducationService.jsonToItem(edu1), EducationService.jsonToItem(edu2), EducationService.jsonToItem(edu3)],
                });
            });

            let res: Array<Education> = await service.readAll();
            expect(res).not.undefined;
            expect(res.length).to.eql(3);
            expect(res[0].id).to.eql(edu1.id);
            expect(res[0].school).to.eql(edu1.school);
            expect(res[0].degree).to.eql(edu1.degree);
            expect(res[0].graduationDate).to.eql(edu1.graduationDate);
            expect(res[0].location).to.eql(edu1.location);
            expect(res[0].isCurrentlyAttending).to.eql(edu1.isCurrentlyAttending);

            expect(res[1].id).to.eql(edu2.id);
            expect(res[1].school).to.eql(edu2.school);
            expect(res[1].degree).to.eql(edu2.degree);
            expect(res[1].graduationDate).to.eql(edu2.graduationDate);
            expect(res[1].location).to.eql(edu2.location);
            expect(res[1].isCurrentlyAttending).to.eql(edu2.isCurrentlyAttending);

            expect(res[2].id).to.eql(edu3.id);
            expect(res[2].school).to.eql(edu3.school);
            expect(res[2].degree).to.eql(edu3.degree);
            expect(res[2].graduationDate).to.eql(edu3.graduationDate);
            expect(res[2].location).to.eql(edu3.location);
            expect(res[2].isCurrentlyAttending).to.eql(edu3.isCurrentlyAttending);
        }));

        it('Can get many items', mochaAsync(async () => {
            let itemList: DynamoDB.ItemList = [];

            for (let i = 0; i < randomNumber(1000, 100); i++) { //create anywhere from 100 to 1000
                itemList.push(EducationService.jsonToItem(generateEducation()));
            }

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: itemList.length,
                    Items: itemList,
                });
            });

            let res: Array<Education> = await service.readAll();
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

            await service.upsert(generateEducation())
                .then(() => expect.fail(null, null, "Upsert should have failed when an error was returned from SDK"))
                .catch(reason => expect(reason).to.eql(err.message));
        }));
    });
});

export const generateEducation = function (withId: boolean = true) : Education {
    let result: Education = {
        school: randomNumber(50).toString(36),
        degree: randomNumber(50).toString(36),
        location: randomNumber(200, 20).toString(36),
        isCurrentlyAttending: false,
        graduationDate: new Date(randomNumber(2020, 2010), randomNumber(12), randomNumber(28))
    };

    if (withId) {
        result.id = uuid();
    }

    return result;
};