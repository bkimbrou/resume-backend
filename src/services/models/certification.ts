import {GenericInterface} from "./genericInterface";

interface CertificationInterface extends GenericInterface{
    name?: string,
    description?: string,
    dateIssued?: string,
    dateExpires?: string,
    image?: string,
}

export type Certification = keyof CertificationInterface;
