import {Generic} from "./generic";

export interface Certification extends Generic{
    name: string,
    description: string,
    dateIssued: Date,
    dateExpires?: Date,
    image?: string,
}
