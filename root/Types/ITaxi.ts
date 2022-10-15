import { ObjectId } from "mongodb";

export interface ITaxi {
    name?: string;
    route?: ObjectId;
    currentDriver?: ObjectId;
    number?: string;
    plateNumber?: string;
    seatsTaken?: string
}

export interface INewTaxi {
    name?: string;
    currentDriver?: ObjectId;
    number?: string;
    plateNumber?: string;
    seatsTaken?: string
    from?: string;
    to?: string;
    capacity?: string;
}