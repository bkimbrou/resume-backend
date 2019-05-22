import {DynamoDB} from "aws-sdk";

export interface Generic {
    id?: string
    createdTime?: Date,
    modifiedTime?: Date
}