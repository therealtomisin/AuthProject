import { ObjectId } from "mongodb";

export interface ITaxi {
    name?: string;
    route?: ObjectId;
    currentDriver?: ObjectId;
    number?: string;
    plateNumber?: string;
}