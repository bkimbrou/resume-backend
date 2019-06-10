import {mochaAsync} from './mochaHelper';
import 'mocha';
import {expect} from 'chai';
import * as sinon from 'sinon'

import {generateSkill} from './services/skills/skillService.spec';
import {LambdaInput, LambdaResult} from './services/models/lambda';
import * as handler from './handler';
import {Skill} from './services/models/skill';
import {Generic} from './services/models/generic';
import uuid = require('uuid');
import {generateCertification} from './services/certifications/certificationService.spec';
import {Certification} from './services/models/certification';
import {generateJob} from './services/jobs/jobService.spec';
import {Job} from './services/models/job';
import {Education} from './services/models/education';
import {generateEducation} from './services/education/educationService.spec';
import {ClientContext, CognitoIdentity, Context} from 'aws-lambda';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import {GetItemInput} from 'aws-sdk/clients/dynamodb';
import {SkillService} from './services/skills/skillService';
import {CertificationService} from './services/certifications/certificationService';
import {JobService} from './services/jobs/jobService';
import {EducationService} from './services/education/educationService';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_ACCEPTED = 202;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const CONTENT_TYPE = 'Content-Type';

const CONTEXT: Context = new class implements Context {
    awsRequestId: string = '';
    callbackWaitsForEmptyEventLoop: boolean = false;
    clientContext: ClientContext = {
        client: {
            installationId: '',
            appTitle: '',
            appVersionName: '',
            appVersionCode: '',
            appPackageName: ''
        },
        env: {
            platformVersion: '',
            platform: '',
            make: '',
            model: '',
            locale: '',
        }
    };
    functionName: string = '';
    functionVersion: string = '';
    identity: CognitoIdentity = {
        cognitoIdentityId: '',
        cognitoIdentityPoolId: ''
    };
    invokedFunctionArn: string = '';
    logGroupName: string = '';
    logStreamName: string = '';
    memoryLimitInMB: number = 128;

    done(error?: Error, result?: any): void {
    }

    fail(error: Error | string): void {
    }

    getRemainingTimeInMillis(): number {
        return 0;
    }

    succeed(messageOrObject: any): void;
    succeed(message: string, object: any): void;
    succeed(messageOrObject: any | string, object?: any): void {
    }
};

describe("Index Tests", () => {
    let stub: sinon.SinonStub<any, any>;
    let env: NodeJS.ProcessEnv;

    before(() => {
        env = process.env;
        process.env = {CONFIG_TABLE: 'config_table'};
        AWSMock.setSDKInstance(AWS);

        AWSMock.mock('DynamoDB', 'getItem', (params: GetItemInput, callback: Function) => {
            console.log('DynamoDB', 'getItem', 'mock called');
            callback(null, {
                Item: {
                    certificationsTable: {
                        S: 'cert_table'
                    },
                    certificationsReadLimit: {
                        N: '50'
                    },
                    educationTable: {
                        S: 'edu_table'
                    },
                    educationReadLimit: {
                        N: '50'
                    },
                    jobsTable: {
                        S: 'job_table'
                    },
                    jobsReadLimit: {
                        N: '50'
                    },
                    skillsTable: {
                        S: 'skill_table'
                    },
                    skillsReadLimit: {
                        N: '50'
                    }
                }
            });
        });
    });

    afterEach(() => stub.restore());

    after(() => {
        AWSMock.restore();
        process.env = env;
    });

    describe("Certifications Repository", () => {
        let certificationService: CertificationService;
        let getCertificationStub: sinon.SinonStub<any, any>;

        before(() => {
            certificationService = new CertificationService('dummy_table', 10);
            getCertificationStub = sinon.stub(handler, 'getCertificationService').returns(certificationService);
        });

        after(() => getCertificationStub.restore());

        it("Can read certifications successfully", mochaAsync(async () => {
            stub = sinon.stub(certificationService, 'readAll').returns(Promise.resolve([generateCertification()]));
            const result: LambdaResult = await handler.readCertificationsHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading certifications", mochaAsync(async () => {
            stub = sinon.stub(certificationService, 'readAll').returns(Promise.reject('Failed to read all certifications'));
            const result: LambdaResult = await handler.readCertificationsHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all certifications');
        }));

        it("Can insert certification successfully", mochaAsync(async () => {
            const certification: Certification = generateCertification(false);
            const input: LambdaInput = {data: certification};
            stub = sinon.stub(certificationService, 'upsert');
            stub.withArgs(certification).returns(Promise.resolve());
            const result: LambdaResult = await handler.upsertCertificationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting certification", mochaAsync(async () => {
            const certification: Certification = generateCertification(false);
            const input: LambdaInput = {data: certification};
            stub = sinon.stub(certificationService, 'upsert');
            stub.withArgs(certification).returns(Promise.reject('Failed to put certification in database'));
            const result: LambdaResult = await handler.upsertCertificationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put certification in database');
        }));

        it("Can delete certification successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(certificationService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await handler.deleteCertificationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete certification", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(certificationService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete certification from database'));
            const result: LambdaResult = await handler.deleteCertificationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete certification from database');
        }));
    });

    describe("Education Repository", () => {
        let educationService: EducationService;
        let getEducationStub: sinon.SinonStub<any, any>;

        before(() => {
            educationService = new EducationService('dummy_table', 10);
            getEducationStub = sinon.stub(handler, 'getEducationService').returns(educationService);
        });

        after(() => getEducationStub.restore());

        it("Can read education successfully", mochaAsync(async () => {
            stub = sinon.stub(educationService, 'readAll').returns(Promise.resolve([generateEducation()]));
            const result: LambdaResult = await handler.readEducationHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading education", mochaAsync(async () => {
            stub = sinon.stub(educationService, 'readAll').returns(Promise.reject('Failed to read all education'));
            const result: LambdaResult = await handler.readEducationHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all education');
        }));

        it("Can insert education successfully", mochaAsync(async () => {
            const education: Education = generateEducation(false);
            const input: LambdaInput = {data: education};
            stub = sinon.stub(educationService, 'upsert');
            stub.withArgs(education).returns(Promise.resolve());
            const result: LambdaResult = await handler.upsertEducationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting education", mochaAsync(async () => {
            const education: Education = generateEducation(false);
            const input: LambdaInput = {data: education};
            stub = sinon.stub(educationService, 'upsert');
            stub.withArgs(education).returns(Promise.reject('Failed to put education in database'));
            const result: LambdaResult = await handler.upsertEducationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put education in database');
        }));

        it("Can delete education successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(educationService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await handler.deleteEducationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete education", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(educationService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete education from database'));
            const result: LambdaResult = await handler.deleteEducationHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete education from database');
        }));
    });

    describe("Jobs Repository", () => {
        let jobService: JobService;
        let getJobStub: sinon.SinonStub<any, any>;

        before(() => {
            jobService = new JobService('dummy_table', 10);
            getJobStub = sinon.stub(handler, 'getJobService').returns(jobService);
        });

        after(() => getJobStub.restore());

        it("Can read jobs successfully", mochaAsync(async () => {
            stub = sinon.stub(jobService, 'readAll').returns(Promise.resolve([generateJob()]));
            const result: LambdaResult = await handler.readJobsHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading jobs", mochaAsync(async () => {
            stub = sinon.stub(jobService, 'readAll').returns(Promise.reject('Failed to read all jobs'));
            const result: LambdaResult = await handler.readJobsHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all jobs');
        }));

        it("Can insert job successfully", mochaAsync(async () => {
            const job: Job = generateJob(false);
            const input: LambdaInput = {data: job};
            stub = sinon.stub(jobService, 'upsert');
            stub.withArgs(job).returns(Promise.resolve());
            const result: LambdaResult = await handler.upsertJobHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting job", mochaAsync(async () => {
            const job: Job = generateJob(false);
            const input: LambdaInput = {data: job};
            stub = sinon.stub(jobService, 'upsert');
            stub.withArgs(job).returns(Promise.reject('Failed to put job in database'));
            const result: LambdaResult = await handler.upsertJobHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put job in database');
        }));

        it("Can delete job successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(jobService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await handler.deleteJobHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete job", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(jobService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete job from database'));
            const result: LambdaResult = await handler.deleteJobHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete job from database');
        }));
    });

    describe("Skills Repository", () => {
        let skillService: SkillService;
        let getSkillsStub: sinon.SinonStub<any, any>;

        before(() => {
            skillService = new SkillService('dummy_table', 10);
            getSkillsStub = sinon.stub(handler, 'getSkillService').returns(skillService);
        });

        after(() => getSkillsStub.restore());

        it("Can read skills successfully", mochaAsync(async () => {
            stub = sinon.stub(skillService, 'readAll').returns(Promise.resolve([generateSkill()]));
            const result: LambdaResult = await handler.readSkillsHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading skills", mochaAsync(async () => {
            stub = sinon.stub(skillService, 'readAll').returns(Promise.reject('Failed to read all skills'));
            const result: LambdaResult = await handler.readSkillsHandler({}, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all skills');
        }));

        it("Can insert skill successfully", mochaAsync(async () => {
            const skill: Skill = generateSkill(false);
            const input: LambdaInput = {data: skill};
            stub = sinon.stub(skillService, 'upsert');
            stub.withArgs(skill).returns(Promise.resolve());
            const result: LambdaResult = await handler.upsertSkillHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting skill", mochaAsync(async () => {
            const skill: Skill = generateSkill(false);
            const input: LambdaInput = {data: skill};
            stub = sinon.stub(skillService, 'upsert');
            stub.withArgs(skill).returns(Promise.reject('Failed to put skill in database'));
            const result: LambdaResult = await handler.upsertSkillHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put skill in database');
        }));

        it("Can delete skill successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(skillService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await handler.deleteSkillHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete skill", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            const input: LambdaInput = {data: id};
            stub = sinon.stub(skillService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete skill from database'));
            const result: LambdaResult = await handler.deleteSkillHandler(input, CONTEXT, () => {});

            expect(result.statusCode).to.eql(HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete skill from database');
        }));
    });
});