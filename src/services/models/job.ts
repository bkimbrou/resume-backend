import {Generic} from './generic';

export interface Job extends Generic {
    employer: string,
    title: string,
    responsibilities: Array<string>,
    startDate: Date,
    endDate?: Date
}
