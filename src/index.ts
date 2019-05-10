import {Skill} from "./models/skill";
import {Job} from "./models/job";
import {Certification} from "./models/certification";
import {Education} from "./models/education";
import {Certifications} from "./certifications/certifications";
import {v4 as uuid} from 'uuid';

export const readSkillsHandler = async (event: any = {}, context: any = {}): Promise<Array<Skill>> => {
    return [];
};
export const createSkillHandler = async (event: any = {}, context: any = {}): Promise<void> => {};
export const updateSkillHandler = async (event: any = {}, context: any = {}): Promise<void> => {};
export const deleteSkillHandler = async (event: any = {}, context: any = {}): Promise<void> => {};

export const readJobsHandler = async (event: any = {}, context: any = {}): Promise<Array<Job>> => {
    return [];
};
export const createJobHandler = async (event: any = {}, context: any = {}): Promise<any> => {};
export const updateJobHandler = async (event: any = {}, context: any = {}): Promise<any> => {};
export const deleteJobHandler = async (event: any = {}, context: any = {}): Promise<any> => {};

export const readCertificationsHandler = async (event: any = {}, context: any = {}): Promise<Array<Certification>> => {
    return Certifications.readAll(event, context);
};
export const createCertificationHandler = async (event: any = {}, context: any = {}): Promise<void> => {
    if (!event.hasOwnProperty('id')) {
        event.id = uuid()
    }
    return Certifications.upsert(event, context);
};
export const updateCertificationHandler = async (event: any = {}, context: any = {}): Promise<void> => {
    return Certifications.upsert(event, context);
};
export const deleteCertificationHandler = async (event: any = {}, context: any = {}): Promise<void> => {
    return Certifications.delete(event, context);
};

export const readEducationHandler = async (event: any = {}, context: any = {}): Promise<Array<Education>> => {
    return [];
};
export const createEducationHandler = async (event: any = {}, context: any = {}): Promise<any> => {};
export const updateEducationHandler = async (event: any = {}, context: any = {}): Promise<any> => {};
export const deleteEducationHandler = async (event: any = {}, context: any = {}): Promise<any> => {};
