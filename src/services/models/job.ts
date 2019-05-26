import {Generic} from './generic';

export interface Job extends Generic {
    employer: string,
    title: string,
    startDate: Date,
    responsibilities: Array<string>,
    endDate?: Date
}
