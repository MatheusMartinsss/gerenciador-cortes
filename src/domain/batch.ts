import { ISection } from "./section";


export interface IBatch {
    id: string;
    number: number;
    createdAt: Date;
    updatedAt: Date;
    sections: ISection[]
    volumeM3: number;
}