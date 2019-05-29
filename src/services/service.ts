import {Generic} from './models/generic';

export interface Service<T extends Generic> {

    readAll(event: any, context: any) : Promise<Array<T>>;

    upsert(event: any, context: any) : Promise<void>;

    delete(event: any, context: any) : Promise<void>;

}