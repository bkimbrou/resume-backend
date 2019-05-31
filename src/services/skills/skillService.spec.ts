import {SkillService} from './skillService';
import {Skill} from '../models/skill';
import AWS, {AWSError, DynamoDB} from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import {expect} from 'chai';
import {mochaAsync, randomNumber} from '../../mochaHelper';
import 'mocha';
import {PutItemInput, ScanInput} from 'aws-sdk/clients/dynamodb';
import uuid = require('uuid');

describe('Skill Service Tests', () => {
    let service: SkillService;

    before(async (done) => {
        AWSMock.setSDKInstance(AWS);
        done();
    });

    beforeEach(async (done) => {
        service = new SkillService();
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

            const skill: Skill = generateSkill(false);

            await service.upsert(skill); //upsert was successfully called and resolved successfully
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

            let res: Array<Skill> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(0);
        }));

        it('Can get one item', mochaAsync(async () => {
            const skill: Skill = generateSkill();

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: 1,
                    Items: [SkillService.jsonToItem(skill)],
                });
            });

            let res: Array<Skill> = await service.readAll();
            expect(res).is.not.undefined;
            expect(res.length).to.eql(1);
            expect(res[0].id).to.eql(skill.id);
            expect(res[0].name).to.eql(skill.name);
            expect(res[0].description).to.eql(skill.description);
            expect(res[0].monthsOfExperience).to.eql(skill.monthsOfExperience);
            expect(res[0].dateLastUsed).to.eql(skill.dateLastUsed);
        }));

        it('Can get three items', mochaAsync(async () => {
            const skill1: Skill = generateSkill();

            const skill2: Skill = generateSkill();

            const skill3: Skill = generateSkill();

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: 3,
                    Items: [SkillService.jsonToItem(skill1), SkillService.jsonToItem(skill2), SkillService.jsonToItem(skill3)],
                });
            });

            let res: Array<Skill> = await service.readAll();
            expect(res).not.undefined;
            expect(res.length).to.eql(3);
            expect(res[0].id).to.eql(skill1.id);
            expect(res[0].name).to.eql(skill1.name);
            expect(res[0].description).to.eql(skill1.description);
            expect(res[0].monthsOfExperience).to.eql(skill1.monthsOfExperience);
            expect(res[0].dateLastUsed).to.eql(skill1.dateLastUsed);

            expect(res[1].id).to.eql(skill2.id);
            expect(res[1].name).to.eql(skill2.name);
            expect(res[1].description).to.eql(skill2.description);
            expect(res[1].monthsOfExperience).to.eql(skill2.monthsOfExperience);
            expect(res[1].dateLastUsed).to.eql(skill2.dateLastUsed);

            expect(res[2].id).to.eql(skill3.id);
            expect(res[2].name).to.eql(skill3.name);
            expect(res[2].description).to.eql(skill3.description);
            expect(res[2].monthsOfExperience).to.eql(skill3.monthsOfExperience);
            expect(res[2].dateLastUsed).to.eql(skill3.dateLastUsed);
        }));

        it('Can get many items', mochaAsync(async () => {
            let itemList: DynamoDB.ItemList = [];

            for (let i = 0; i < randomNumber(1000, 100); i++) { //create anywhere from 100 to 1000
                itemList.push(SkillService.jsonToItem(generateSkill()));
            }

            AWSMock.mock('DynamoDB', 'scan', (params: ScanInput, callback: Function) => {
                console.log('DynamoDB', 'scan', 'mock called');
                callback(null, {
                    ScannedCount: itemList.length,
                    Items: itemList,
                });
            });

            let res: Array<Skill> = await service.readAll();
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

            await service.upsert(generateSkill())
                .then(() => expect.fail(null, null, "Upsert should have failed when an error was returned from SDK"))
                .catch(reason => expect(reason).to.eql(err.message));
        }));
    });
});

export const generateSkill = function (withId: boolean = true) : Skill {
    let result: Skill = {
        name: randomNumber(50).toString(36),
        description: randomNumber(50).toString(36),
        monthsOfExperience: randomNumber(60, 1),
        dateLastUsed: new Date(randomNumber(2020, 2010), randomNumber(12), randomNumber(28))
    };

    if (withId) {
        result.id = uuid();
    }

    return result;
};