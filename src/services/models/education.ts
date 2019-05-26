import {Generic} from './generic';

export interface Education extends Generic{
    school: string,
    location: string,
    isCurrentlyAttending: boolean,
    degree: string,
    graduationDate?: Date
}
