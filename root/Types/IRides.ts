import { ObjectId } from "mongodb";

export interface IRides {
    passenger?: ObjectId;
    assignedRider?: ObjectId;
    routeId?: ObjectId;
    status?: string;
    _id?: ObjectId
}