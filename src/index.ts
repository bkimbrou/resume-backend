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

const APPLICATION_JSON = 'application/json';
const DEFAULT_HEADERS = new Map().set('Content-Type', APPLICATION_JSON);

export let skillService: SkillService;
export let jobService: JobService;
export let educationService: EducationService;
export let certificationService: CertificationService;

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
                return Promise.reject(AbstractDynamoService.itemToJson(result.Item));
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

export const readSkillsHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        skillService = new SkillService(config.skillsTable, config.skillsReadLimit);
        let data: Array<Skill> = await skillService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertSkillHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        skillService = new SkillService(config.skillsTable, config.skillsReadLimit);
        await skillService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteSkillHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        skillService = new SkillService(config.skillsTable, config.skillsReadLimit);
        await skillService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readJobsHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        jobService = new JobService(config.jobsTable, config.jobsReadLimit);
        let data: Array<Job> = await jobService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertJobHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        jobService = new JobService(config.jobsTable, config.jobsReadLimit);
        await jobService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteJobHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        jobService = new JobService(config.jobsTable, config.jobsReadLimit);
        await jobService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readCertificationsHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        certificationService = new CertificationService(config.certificationsTable, config.certificationsReadLimit);
        let data: Array<Certification> = await certificationService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertCertificationHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        certificationService = new CertificationService(config.certificationsTable, config.certificationsReadLimit);
        await certificationService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteCertificationHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        certificationService = new CertificationService(config.certificationsTable, config.certificationsReadLimit);
        await certificationService.delete(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};

export const readEducationHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        educationService = new EducationService(config.educationTable, config.educationReadLimit);
        let data: Array<Education> = await educationService.readAll(event, context);
        return handleSuccess(data);
    }
    catch (err) {
        return handleError(err);
    }
};
export const upsertEducationHandler: Handler = async (event: LambdaInput, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        educationService = new EducationService(config.educationTable, config.educationReadLimit);
        await educationService.upsert(event.data, context);
        return handleAccepted();
    }
    catch (err) {
        return handleError(err);
    }
};
export const deleteEducationHandler: Handler = async (event: LambdaInput = {}, context: Context): Promise<LambdaResult> => {
    try {
        const config: Config = await getConfig(context);
        educationService = new EducationService(config.educationTable, config.educationReadLimit);
        await educationService.delete(event.data, context);
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