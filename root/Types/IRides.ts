import { ObjectId } from "mongodb";
;
export interface IRides {
    passengers?: ObjectId[];
    assignedRider?: ObjectId;
    routeId?: ObjectId;
    status?: string;
    _id?: ObjectId;
    rating?: string
}