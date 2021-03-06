import {Skill} from './services/models/skill';
import {Job} from './services/models/job';
import {Certification} from './services/models/certification';
import {Education} from './services/models/education';
import {CertificationService} from './services/certifications/certificationService';
import {SkillService} from './services/skills/skillService';
import {JobService} from './services/jobs/jobService';
import {EducationService} from './services/education/educationService';
import {LambdaInput, LambdaResult} from './services/models/lambda';
import AWS from 'aws-sdk';
import {AbstractDynamoService} from './services/abstractDynamoService';
import {Context, Handler} from 'aws-lambda'
import {Config} from './services/models/config';

const APPLICATION_JSON = 'application/json';
const DEFAULT_HEADERS = new Map().set('Content-Type', APPLICATION_JSON);

const getConfig = async (context: Context): Promise<Config> => {
    const dynamo = new AWS.DynamoDB();
    if (process.env.CONFIG_TABLE) {
        const config = await dynamo.getItem({
            TableName: process.env.CONFIG_TABLE,
            Key: {
                'env': {
                    S: context.functionVersion
                }
            }
        });
        return config.promise().then(result => {
            if (result.Item) {
                return Promise.resolve(AbstractDynamoService.itemToJson(result.Item));
            } else {
                return Promise.reject("No configuration items found");
            }
        }).catch(err => {
            return Promise.reject(err);
        });
    } else {
        return Promise.reject("Configuration table not specified");
    }
};

export const getCertificationService = (config: Config): CertificationService => {
    return new CertificationService(config.certificationsTable, config.certificationsReadLimit);
};

export const readCertificationsHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const certificationService: CertificationService = getCertificationService(await getConfig(context));
        let data: Array<Certification> = await certificationService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};

export const upsertCertificationHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const certificationService: CertificationService = getCertificationService(await getConfig(context));
        await certificationService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const deleteCertificationHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const certificationService: CertificationService = getCertificationService(await getConfig(context));
        await certificationService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const getEducationService = (config: Config): EducationService => {
    return new EducationService(config.educationTable, config.educationReadLimit);
};

export const readEducationHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const educationService: EducationService = getEducationService(await getConfig(context));
        let data: Array<Education> = await educationService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};

export const upsertEducationHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const educationService: EducationService = getEducationService(await getConfig(context));
        await educationService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const deleteEducationHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const educationService: EducationService = getEducationService(await getConfig(context));
        await educationService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const getJobService = (config: Config): JobService => {
    return new JobService(config.jobsTable, config.jobsReadLimit);
};

export const readJobsHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const jobService: JobService = getJobService(await getConfig(context));
        let data: Array<Job> = await jobService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};

export const upsertJobHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const jobService: JobService = getJobService(await getConfig(context));
        await jobService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const deleteJobHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const jobService: JobService = getJobService(await getConfig(context));
        await jobService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const getSkillService = (config: Config): SkillService => {
    return new SkillService(config.skillsTable, config.skillsReadLimit);
};

export const readSkillsHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const skillService: SkillService = getSkillService(await getConfig(context));
        let data: Array<Skill> = await skillService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};

export const upsertSkillHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const skillService: SkillService = getSkillService(await getConfig(context));
        await skillService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const deleteSkillHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const skillService: SkillService = getSkillService(await getConfig(context));
        await skillService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

const handleError = function (err: any) {
    return Promise.resolve({
        statusCode: 500,
        headers: DEFAULT_HEADERS,
        data: err
    });
};

const handleSuccess = function (data: any) {
    return Promise.resolve({
        statusCode: 200,
        headers: DEFAULT_HEADERS,
        data: data
    });
};

const handleAccepted = function () {
    return Promise.resolve({
        statusCode: 202
    });
};