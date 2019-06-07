import {mochaAsync} from './mochaHelper';
import 'mocha';
import {expect} from 'chai';
import * as sinon from 'sinon'

import {generateSkill} from './services/skills/skillService.spec';
import {LambdaResult} from './services/models/lambda';
import {
    certificationService, deleteCertificationHandler, deleteEducationHandler, deleteJobHandler,
    deleteSkillHandler, educationService, jobService,
    readCertificationsHandler, readEducationHandler, readJobsHandler,
    readSkillsHandler,
    skillService, upsertCertificationHandler, upsertEducationHandler, upsertJobHandler,
    upsertSkillHandler
} from './index';
import {constants as http2Constants} from 'http2';
import {Skill} from './services/models/skill';
import {Generic} from './services/models/generic';
import uuid = require('uuid');
import {generateCertification} from './services/certifications/certificationService.spec';
import {Certification} from './services/models/certification';
import {generateJob} from './services/jobs/jobService.spec';
import {Job} from './services/models/job';
import {Education} from './services/models/education';
import {generateEducation} from './services/education/educationService.spec';

describe("Index Tests", () => {
    let stub: sinon.SinonStub<any, any>;

    afterEach(() => stub.restore());

    describe("Skills Repository", () => {
        it("Can read skills successfully", mochaAsync(async () => {
            stub = sinon.stub(skillService, 'readAll').returns(Promise.resolve([generateSkill()]));
            const result: LambdaResult = await readSkillsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading skills", mochaAsync(async () => {
            stub = sinon.stub(skillService, 'readAll').returns(Promise.reject('Failed to read all skills'));
            const result: LambdaResult = await readSkillsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all skills');
        }));

        it("Can insert skill successfully", mochaAsync(async () => {
            const skill: Skill = generateSkill(false);
            stub = sinon.stub(skillService, 'upsert');
            stub.withArgs(skill).returns(Promise.resolve());
            const result: LambdaResult = await upsertSkillHandler(skill);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting skill", mochaAsync(async () => {
            const skill: Skill = generateSkill(false);
            stub = sinon.stub(skillService, 'upsert');
            stub.withArgs(skill).returns(Promise.reject('Failed to put skill in database'));
            const result: LambdaResult = await upsertSkillHandler(skill);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put skill in database');
        }));

        it("Can delete skill successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(skillService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await deleteSkillHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete skill", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(skillService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete skill from database'));
            const result: LambdaResult = await deleteSkillHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete skill from database');
        }));
    });

    describe("Certifications Repository", () => {
        it("Can read certifications successfully", mochaAsync(async () => {
            stub = sinon.stub(certificationService, 'readAll').returns(Promise.resolve([generateCertification()]));
            const result: LambdaResult = await readCertificationsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading certifications", mochaAsync(async () => {
            stub = sinon.stub(certificationService, 'readAll').returns(Promise.reject('Failed to read all certifications'));
            const result: LambdaResult = await readCertificationsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all certifications');
        }));

        it("Can insert certification successfully", mochaAsync(async () => {
            const certification: Certification = generateCertification(false);
            stub = sinon.stub(certificationService, 'upsert');
            stub.withArgs(certification).returns(Promise.resolve());
            const result: LambdaResult = await upsertCertificationHandler(certification);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting certification", mochaAsync(async () => {
            const certification: Certification = generateCertification(false);
            stub = sinon.stub(certificationService, 'upsert');
            stub.withArgs(certification).returns(Promise.reject('Failed to put certification in database'));
            const result: LambdaResult = await upsertCertificationHandler(certification);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put certification in database');
        }));

        it("Can delete certification successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(certificationService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await deleteCertificationHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete certification", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(certificationService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete certification from database'));
            const result: LambdaResult = await deleteCertificationHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete certification from database');
        }));
    });

    describe("Jobs Repository", () => {
        it("Can read jobs successfully", mochaAsync(async () => {
            stub = sinon.stub(jobService, 'readAll').returns(Promise.resolve([generateJob()]));
            const result: LambdaResult = await readJobsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading jobs", mochaAsync(async () => {
            stub = sinon.stub(jobService, 'readAll').returns(Promise.reject('Failed to read all jobs'));
            const result: LambdaResult = await readJobsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all jobs');
        }));

        it("Can insert job successfully", mochaAsync(async () => {
            const job: Job = generateJob(false);
            stub = sinon.stub(jobService, 'upsert');
            stub.withArgs(job).returns(Promise.resolve());
            const result: LambdaResult = await upsertJobHandler(job);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting job", mochaAsync(async () => {
            const job: Job = generateJob(false);
            stub = sinon.stub(jobService, 'upsert');
            stub.withArgs(job).returns(Promise.reject('Failed to put job in database'));
            const result: LambdaResult = await upsertJobHandler(job);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put job in database');
        }));

        it("Can delete job successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(jobService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await deleteJobHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete job", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(jobService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete job from database'));
            const result: LambdaResult = await deleteJobHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete job from database');
        }));
    });

    describe("Education Repository", () => {
        it("Can read education successfully", mochaAsync(async () => {
            stub = sinon.stub(educationService, 'readAll').returns(Promise.resolve([generateEducation()]));
            const result: LambdaResult = await readEducationHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading education", mochaAsync(async () => {
            stub = sinon.stub(educationService, 'readAll').returns(Promise.reject('Failed to read all education'));
            const result: LambdaResult = await readEducationHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all education');
        }));

        it("Can insert education successfully", mochaAsync(async () => {
            const education: Education = generateEducation(false);
            stub = sinon.stub(educationService, 'upsert');
            stub.withArgs(education).returns(Promise.resolve());
            const result: LambdaResult = await upsertEducationHandler(education);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when inserting education", mochaAsync(async () => {
            const education: Education = generateEducation(false);
            stub = sinon.stub(educationService, 'upsert');
            stub.withArgs(education).returns(Promise.reject('Failed to put education in database'));
            const result: LambdaResult = await upsertEducationHandler(education);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to put education in database');
        }));

        it("Can delete education successfully", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(educationService, 'delete');
            stub.withArgs(id).returns(Promise.resolve());
            const result: LambdaResult = await deleteEducationHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_ACCEPTED);
        }));

        it("Can handle an error when delete education", mochaAsync(async () => {
            const id: Generic = {id: uuid()};
            stub = sinon.stub(educationService, 'delete');
            stub.withArgs(id).returns(Promise.reject('Failed to delete education from database'));
            const result: LambdaResult = await deleteEducationHandler(id);

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to delete education from database');
        }));
    });
});