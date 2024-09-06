import { ISection } from "./section";


export interface IBatch {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    sections: ISection[]
    volumeM3: number;
}