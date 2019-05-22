import {Generic} from "./generic";

export interface Skill extends Generic{
    name: string,
    description: string,
    monthsOfExperience: number
    dateLastUsed: Date
}
