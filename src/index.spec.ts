import {mochaAsync, mockModule} from './mochaHelper';
import 'mocha';
import {expect} from 'chai';
import * as sinon from 'sinon'

import {SkillService} from './services/skills/skillService'
import {generateSkill} from './services/skills/skillService.spec';
import {LambdaResult} from './services/models/lambda';
import {readSkillsHandler} from './index';
import {constants as http2Constants} from 'http2';

describe("Index Tests", () => {
    describe("Skills Repository", () => {
        const skillService: SkillService = new SkillService();
        const mockSkillRepository = mockModule(skillService, {
            readAll: () => Promise.resolve([generateSkill()]),
            upsert: () => Promise.resolve(),
            delete: () => Promise.resolve()
        });

        const mockSkillRepositoryError = mockModule(skillService, {
            readAll: () => Promise.reject('Failed to read all skills'),
            upsert: () => Promise.reject('Failed to put skill in database'),
            delete: () => Promise.reject('Failed to delete skill from database')
        });

        let sandbox: sinon.SinonSandbox;

        beforeEach(() => {
            sandbox = sinon.createSandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("Can read skills successfully", mochaAsync(async () => {
            mockSkillRepository(sandbox);
            const result: LambdaResult = await readSkillsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_OK);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).is.not.undefined;
        }));

        it("Can handle an error when reading skills", mochaAsync(async () => {
            mockSkillRepositoryError(sandbox);
            const result: LambdaResult = await readSkillsHandler();

            expect(result.statusCode).to.eql(http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            expect(result.headers).to.eql(new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, 'application/json'));
            expect(result.data).to.eql('Failed to read all skills');
        }));
    });
});