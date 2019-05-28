import {Skill} from './services/models/skill';
import {Job} from './services/models/job';
import {Certification} from './services/models/certification';
import {Education} from './services/models/education';
import {CertificationService} from './services/certifications/certificationService';
import {SkillService} from './services/skills/skillService';
import {JobService} from './services/jobs/jobService';
import {EducationService} from './services/education/educationService';

export const readSkillsHandler = async (event: any = {}, context: any = {}): Promise<Array<Skill>> => {
    return await new SkillService().readAll(event, context);
};
export const upsertSkillHandler = async (event: Skill, context: any = {}): Promise<Skill> => {
    return await new SkillService().upsert(event, context)
};
export const deleteSkillHandler = async (event: any = {}, context: any = {}): Promise<any> => {
    return await new SkillService().delete(event, context);
};

export const readJobsHandler = async (event: any = {}, context: any = {}): Promise<Array<Job>> => {
    return await new JobService().readAll(event, context);
};
export const upsertJobHandler = async (event: Job, context: any = {}): Promise<Job> => {
    return await new JobService().upsert(event, context);
};
export const deleteJobHandler = async (event: any = {}, context: any = {}): Promise<any> => {
    return await new JobService().delete(event, context);
};

export const readCertificationsHandler = async (event: any = {}, context: any = {}): Promise<Array<Certification>> => {
    return await new CertificationService().readAll(event, context);
};
export const upsertCertificationHandler = async (event: Certification, context: any = {}): Promise<Certification> => {
    return await new CertificationService().upsert(event, context);
};
export const deleteCertificationHandler = async (event: any = {}, context: any = {}): Promise<any> => {
    return await new CertificationService().delete(event, context);
};

export const readEducationHandler = async (event: any = {}, context: any = {}): Promise<Array<Education>> => {
    return await new EducationService().readAll(event, context);
};
export const upsertEducationHandler = async (event: Education, context: any = {}): Promise<Education> => {
    return await new EducationService().upsert(event, context);
};
export const deleteEducationHandler = async (event: any = {}, context: any = {}): Promise<any> => {
    return await new EducationService().delete(event, context);
};
