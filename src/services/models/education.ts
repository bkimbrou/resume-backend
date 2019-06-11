import {Generic} from './generic';

export interface Education extends Generic{
    school: string,
    location: string,
    isCurrentlyAttending: boolean,
    graduated: boolean,
    level: string
    degree: string,
    graduationDate?: Date
}
