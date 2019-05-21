import {Skill} from "./services/models/skill";
import {Job} from "./services/models/job";
import {Certification} from "./services/models/certification";
import {Education} from "./services/models/education";
import {CertificationService} from "./services/certifications/certificationService";
import {SkillService} from "./services/skills/skillService";
import {JobService} from "./services/jobs/jobService";
import {EducationService} from "./services/education/educationService";

export const readSkillsHandler = async (event: any = {}, context: any = {}): Promise<Array<Skill>> => {
    return new SkillService().readAll(event, context);
};
export const createSkillHandler = async (event: Skill = {}, context: any = {}): Promise<void> => {
    return new SkillService().upsert(event, context)
};
export const updateSkillHandler = async (event: Skill = {}, context: any = {}): Promise<void> => {
    return new SkillService().upsert(event, context);
};
export const deleteSkillHandler = async (event: any = {}, context: any = {}): Promise<void> => {
    return new SkillService().delete(event, context);
};

export const readJobsHandler = async (event: any = {}, context: any = {}): Promise<Array<Job>> => {
    return new JobService().readAll(event, context);
};
export const createJobHandler = async (event: Job = {}, context: any = {}): Promise<any> => {
    return new JobService().upsert(event, context);
};
export const updateJobHandler = async (event: Job = {}, context: any = {}): Promise<any> => {
    return new JobService().upsert(event, context);
};
export const deleteJobHandler = async (event: any = {}, context: any = {}): Promise<any> => {
    return new JobService().delete(event, context);
};

export const readCertificationsHandler = async (event: any = {}, context: any = {}): Promise<Array<Certification>> => {
    return new CertificationService().readAll(event, context);
};
export const createCertificationHandler = async (event: Certification = {}, context: any = {}): Promise<void> => {
    return new CertificationService().upsert(event, context);
};
export const updateCertificationHandler = async (event: Certification = {}, context: any = {}): Promise<void> => {
    return new CertificationService().upsert(event, context);
};
export const deleteCertificationHandler = async (event: any = {}, context: any = {}): Promise<void> => {
    return new CertificationService().delete(event, context);
};

export const readEducationHandler = async (event: any = {}, context: any = {}): Promise<Array<Education>> => {
    return new EducationService().readAll(event, context);
};
export const createEducationHandler = async (event: Education = {}, context: any = {}): Promise<any> => {
    return new EducationService().upsert(event, context);
};
export const updateEducationHandler = async (event: Education = {}, context: any = {}): Promise<any> => {
    return new EducationService().upsert(event, context);
};
export const deleteEducationHandler = async (event: any = {}, context: any = {}): Promise<any> => {
    return new EducationService().delete(event, context);
};
