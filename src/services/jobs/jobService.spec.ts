import {JobService} from './jobService';
import {Job} from '../models/job';
import AWS, {AWSError, DynamoDB} from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import {expect} from 'chai';
import {mochaAsync, randomNumber} from '../../mochaHelper';
import 'mocha';
import {PutItemInput, ScanInput} from 'aws-sdk/clients/dynamodb';
import uuid = require('uuid');

describe('Job Service Tests', () => {
    let service: JobService;

    before(async (done) => {
        AWSMock.setSDKInstance(AWS);
        done();
    });

    beforeEach(async (done) => {
        service = new JobService();
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

            const job: Job = generateJob(false);

            await service.upsert(job); //upsert was successfully called and resolved successfully
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

            let res: Array<Job> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(0);
        }));

        it('Can get one item', mochaAsync(async () => {
            const job: Job = generateJob();

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: 1,
                    Items: [JobService.jsonToItem(job)],
                });
            });

            let res: Array<Job> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(1);
            expect(res[0].id).to.eql(job.id);
            expect(res[0].employer).to.eql(job.employer);
            expect(res[0].title).to.eql(job.title);
            expect(res[0].responsibilities).to.eql(job.responsibilities);
            expect(res[0].startDate).to.eql(job.startDate);
            expect(res[0].endDate).to.eql(job.endDate);
        }));

        it('Can get three items', mochaAsync(async () => {
            const job1: Job = generateJob();

            const job2: Job = generateJob();

            const job3: Job = generateJob(true, false);

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: 3,
                    Items: [JobService.jsonToItem(job1), JobService.jsonToItem(job2), JobService.jsonToItem(job3)],
                });
            });

            let res: Array<Job> = await service.readAll();
            expect(res).not.undefined;
            expect(res.length).to.eql(3);
            expect(res[0].id).to.eql(job1.id);
            expect(res[0].employer).to.eql(job1.employer);
            expect(res[0].title).to.eql(job1.title);
            expect(res[0].responsibilities).to.eql(job1.responsibilities);
            expect(res[0].startDate).to.eql(job1.startDate);
            expect(res[0].endDate).to.eql(job1.endDate);

            expect(res[1].id).to.eql(job2.id);
            expect(res[1].employer).to.eql(job2.employer);
            expect(res[1].title).to.eql(job2.title);
            expect(res[1].responsibilities).to.eql(job2.responsibilities);
            expect(res[1].startDate).to.eql(job2.startDate);
            expect(res[1].endDate).to.eql(job2.endDate);

            expect(res[2].id).to.eql(job3.id);
            expect(res[2].employer).to.eql(job3.employer);
            expect(res[2].title).to.eql(job3.title);
            expect(res[2].responsibilities).to.eql(job3.responsibilities);
            expect(res[2].startDate).to.eql(job3.startDate);
            expect(res[2].endDate).to.eql(job3.endDate);
        }));

        it('Can get many items', mochaAsync(async () => {
            let itemList: DynamoDB.ItemList = [];

            for (let i = 0; i < randomNumber(1000, 100); i++) { //create anywhere from 100 to 1000
                itemList.push(JobService.jsonToItem(generateJob()));
            }

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: itemList.length,
                    Items: itemList,
                });
            });

            let res: Array<Job> = await service.readAll();
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

            await service.upsert(generateJob())
                .then(() => expect.fail(null, null, "Upsert should have failed when an error was returned from SDK"))
                .catch(reason => expect(reason).to.eql(err.message));
        }));
    });
});

export const generateJob = function (withId: boolean = true, withEndDate: boolean = true) : Job {
    let result: Job = {
        employer: randomNumber(50).toString(36),
        title: randomNumber(50).toString(36),
        startDate: new Date(randomNumber(2010, 2000), randomNumber(12), randomNumber(28)),
        responsibilities: [
            randomNumber(100).toString(36),
            randomNumber(100).toString(36),
            randomNumber(100).toString(36),
        ]
    };

    if (withId) {
        result.id = uuid();
    }

    if (withEndDate) {
        result.endDate = new Date(randomNumber(2020, 2010), randomNumber(12), randomNumber(28))
    }

    return result;
};