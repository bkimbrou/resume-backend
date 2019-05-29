import {Skill} from './services/models/skill';
import {Job} from './services/models/job';
import {Certification} from './services/models/certification';
import {Education} from './services/models/education';
import {CertificationService} from './services/certifications/certificationService';
import {SkillService} from './services/skills/skillService';
import {JobService} from './services/jobs/jobService';
import {EducationService} from './services/education/educationService';
import {LambdaResult} from './services/models/lambda';
import {constants as http2Constants} from 'http2';

const APPLICATION_JSON = 'application/json';
const DEFAULT_HEADERS = new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, APPLICATION_JSON);

export const readSkillsHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Skill> = await new SkillService().readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertSkillHandler = async (event: Skill, context: any = {}): Promise<LambdaResult> => {
    try {
        await new SkillService().upsert(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteSkillHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await new SkillService().delete(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readJobsHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Job> = await new JobService().readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertJobHandler = async (event: Job, context: any = {}): Promise<LambdaResult> => {
    try {
        await new JobService().upsert(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteJobHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await new JobService().delete(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readCertificationsHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Certification> = await new CertificationService().readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertCertificationHandler = async (event: Certification, context: any = {}): Promise<LambdaResult> => {
    try {
        await new CertificationService().upsert(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteCertificationHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await new CertificationService().delete(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readEducationHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Education> = await new EducationService().readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertEducationHandler = async (event: Education, context: any = {}): Promise<LambdaResult> => {
    try {
        await new EducationService().upsert(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteEducationHandler = async (event: any = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await new EducationService().delete(event, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

const handleError = function (err: any) {
    return Promise.resolve({
        statusCode: http2Constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        headers: DEFAULT_HEADERS,
        data: err
    });
};

const handleSuccess = function (data: any) {
    return Promise.resolve({
        statusCode: http2Constants.HTTP_STATUS_OK,
        headers: DEFAULT_HEADERS,
        data: data
    });
};

const handleAccepted = function () {
    return Promise.resolve({
        statusCode: http2Constants.HTTP_STATUS_ACCEPTED
    });
};