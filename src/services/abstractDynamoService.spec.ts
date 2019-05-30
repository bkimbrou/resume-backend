import {mochaAsync, randomNumber} from '../mochaHelper';
import 'mocha';
import {expect} from 'chai';
import {Generic} from './models/generic';
import uuid = require('uuid');
import {AbstractDynamoService} from './abstractDynamoService';
import {DynamoDB} from 'aws-sdk';

interface TestObject {
    nil: null,
    str: string,
    num: number,
    bool: boolean,
    buf: Buffer,
    map: Generic,
    strArray: Array<string>,
    numArray: Array<number>,
    bufArray: Array<Buffer>,
    mapArray: Array<Generic>
}

describe("Core Dynamo Service Tests", () => {
    it("Can convert a JSON object to a Dynamo Attribute map", mochaAsync(async () => {
        const obj: TestObject = {
            nil: null,
            str: randomNumber(10).toString(36),
            num: randomNumber(100),
            bool: randomNumber(1, 0) === 1,
            buf: new Buffer(randomNumber(10).toString()),
            map: {
                id: uuid(),
                createdTime: new Date(),
                modifiedTime: new Date()
            },
            strArray: [
                randomNumber(10).toString(36),
                randomNumber(10).toString(36),
                randomNumber(10).toString(36)
            ],
            numArray: [
                randomNumber(100),
                randomNumber(100),
                randomNumber(100)
            ],
            bufArray: [
                new Buffer(randomNumber(10).toString()),
                new Buffer(randomNumber(10).toString()),
                new Buffer(randomNumber(10).toString())
            ],
            mapArray: [
                {
                    id: uuid(),
                    createdTime: new Date(),
                    modifiedTime: new Date()
                },
                {
                    id: uuid(),
                    createdTime: new Date(),
                    modifiedTime: new Date()
                },
                {
                    id: uuid(),
                    createdTime: new Date(),
                    modifiedTime: new Date()
                }
            ]
        };

        const result: DynamoDB.AttributeMap = AbstractDynamoService.jsonToItem(obj);

        expect(result.nil.NULL).is.true;
        expect(result.str.S).to.eql(obj.str);
        expect(result.num.N).to.eql(obj.num);
        expect(result.bool.BOOL).to.eql(obj.bool);
        expect(result.buf.B).to.eql(obj.buf);
        expect(result.map.M).to.eql(obj.map);
        expect(result.strArray.SS).to.eql(obj.strArray);
        expect(result.numArray.NS).to.eql(obj.numArray);
        expect(result.bufArray.BS).to.eql(obj.bufArray);
        expect(result.mapArray.L).to.eql(obj.mapArray);
    }));

    it("Can convert a Dynamo Attribute map to a JSON object", mochaAsync(async () => {
        const attrMap: DynamoDB.AttributeMap = {
            nil: {
                NULL: true
            },
            str: {
                S: randomNumber(10).toString(36)
            },
            num: {
                N: randomNumber(100).toString()
            },
            bool: {
                BOOL: randomNumber(1, 0) === 1
            },
            buf: {
                B: new Buffer(randomNumber(10).toString())
            },
            map: {
                M: Object.create({
                    id: uuid(),
                    createdTime: new Date(),
                    modifiedTime: new Date()
                })
            },
            strArray: {
                SS: [
                    randomNumber(10).toString(36),
                    randomNumber(10).toString(36),
                    randomNumber(10).toString(36)
                ]
            },
            numArray: {
                NS: [
                    randomNumber(100).toString(),
                    randomNumber(100).toString(),
                    randomNumber(100).toString()
                ]
            },
            bufArray: {
                BS: [
                    new Buffer(randomNumber(10).toString()),
                    new Buffer(randomNumber(10).toString()),
                    new Buffer(randomNumber(10).toString())
                ]
            },
            mapArray: {
                L: [
                    Object.create({
                        id: uuid(),
                        createdTime: new Date(),
                        modifiedTime: new Date()
                    }),
                    Object.create({
                        id: uuid(),
                        createdTime: new Date(),
                        modifiedTime: new Date()
                    }),
                    Object.create({
                        id: uuid(),
                        createdTime: new Date(),
                        modifiedTime: new Date()
                    })
                ]
            }
        }

        const result: TestObject = AbstractDynamoService.itemToJson(attrMap);

        expect(result.nil).is.null;
        expect(result.str).to.eql(attrMap.str.S);
        expect(result.num).to.eql(attrMap.num.N);
        expect(result.bool).to.eql(attrMap.bool.BOOL);
        expect(result.buf).to.eql(attrMap.buf.B);
        expect(result.map).to.eql(attrMap.map.M);
        expect(result.strArray).to.eql(attrMap.strArray.SS);
        expect(result.numArray).to.eql(attrMap.numArray.NS);
        expect(result.bufArray).to.eql(attrMap.bufArray.BS);
        expect(result.mapArray).to.eql(attrMap.mapArray.L);
    }));
});
