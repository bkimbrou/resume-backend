import AWS from 'aws-sdk'
import {Certification} from "../models/certification";
import {DynamoHelper} from "../utils/dynamoHelper";

const dynamo: AWS.DynamoDB = new AWS.DynamoDB();
const tableName: string = 'resume-certifications';

export class Certifications {
    static readAll(event: any, context: any) : Promise<Array<Certification>> {
        return new Promise<Array<Certification>>(Certifications.scanTable);
    }

    static upsert(event: Certification, context: any) : Promise<void> {
        return new Promise<void>(() => Certifications.putItem(event));
    }

    static delete(event: any, context: any) : Promise<void> {
        return new Promise<void>(() => Certifications.deleteItem(event));
    }

    private static scanTable() {
        let params: AWS.DynamoDB.ScanInput = {
            TableName: tableName,
            Select: 'ALL_ATTRIBUTES',
            Limit: 50 //if you have 50 certifications, you have too many :)
        };

        dynamo.scan(params, Certifications.handleScanResults);
    }

    private static handleScanResults(err: AWS.AWSError, data: AWS.DynamoDB.ScanOutput) {
        if (err) {
            console.error(err, err.stack);
            return Promise.reject(err.message)
        }
        else if (data.Items) {
            //TODO: Handle if results were paginated
            return Promise.resolve(DynamoHelper.itemsToJson(data.Items));
        }
        else {
            return Promise.resolve([])
        }
    }

    private static putItem(certification: Certification) {
        let params: AWS.DynamoDB.PutItemInput = {
            Item: DynamoHelper.jsonToItem(certification),
            TableName: tableName
        };

        dynamo.putItem(params, Certifications.handleResult)
    }

    private static deleteItem(key: any) {
        let params: AWS.DynamoDB.DeleteItemInput = {
            Key: key,
            TableName: tableName
        };

        dynamo.putItem(params, Certifications.handleResult)
    }

    private static handleResult(err: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput | AWS.DynamoDB.DeleteItemOutput | AWS.DynamoDB.UpdateItemOutput) {
        if (err) {
            console.error(err, err.stack);
            return Promise.reject(err.message)
        }
        else {
            return Promise.resolve()
        }
    }
}