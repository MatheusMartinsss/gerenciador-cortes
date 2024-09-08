import { ITree } from "./tree";

export interface ICreateSection {
    section: string;
    number: string;
    plate: string;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    volumeM3: number;
    tree_id: number;
    specie_id: string;
    meters: number;
}

export interface ISection {
    id: string
    section: string;
    number: string;
    plate: string;
    commonName: string
    scientificName: string
    d1: number;
    d2: number;
    tree?: ITree
    d3: number;
    d4: number;
    volumeM3: number;
    tree_id: number;
    meters: number;
    createdAt: Date
    updatedAt: Date
}
