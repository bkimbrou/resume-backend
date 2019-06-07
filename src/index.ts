import {Skill} from './services/models/skill';
import {Job} from './services/models/job';
import {Certification} from './services/models/certification';
import {Education} from './services/models/education';
import {CertificationService} from './services/certifications/certificationService';
import {SkillService} from './services/skills/skillService';
import {JobService} from './services/jobs/jobService';
import {EducationService} from './services/education/educationService';
import {LambdaInput, LambdaResult} from './services/models/lambda';
import {constants as http2Constants} from 'http2';

const APPLICATION_JSON = 'application/json';
const DEFAULT_HEADERS = new Map().set(http2Constants.HTTP2_HEADER_CONTENT_TYPE, APPLICATION_JSON);

export const skillService: SkillService = new SkillService();
export const jobService: JobService = new JobService();
export const educationService: EducationService = new EducationService();
export const certificationService: CertificationService = new CertificationService();

export const readSkillsHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Skill> = await skillService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertSkillHandler = async (event: LambdaInput, context: any = {}): Promise<LambdaResult> => {
    try {
        await skillService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteSkillHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await skillService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readJobsHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Job> = await jobService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertJobHandler = async (event: LambdaInput, context: any = {}): Promise<LambdaResult> => {
    try {
        await jobService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteJobHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await jobService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readCertificationsHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Certification> = await certificationService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertCertificationHandler = async (event: LambdaInput, context: any = {}): Promise<LambdaResult> => {
    try {
        await certificationService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteCertificationHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await certificationService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readEducationHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        let data: Array<Education> = await educationService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertEducationHandler = async (event: LambdaInput, context: any = {}): Promise<LambdaResult> => {
    try {
        await educationService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteEducationHandler = async (event: LambdaInput = {}, context: any = {}): Promise<LambdaResult> => {
    try {
        await educationService.delete(event.data, context);
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