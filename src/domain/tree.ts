import { ISection } from "./section";

export interface ICreateTree {
    specie_id: string | null;
    number: string;
    commonName: string;
    scientificName: string;
    dap: number;
    range: number
    meters: number;
    volumeM3: number
    autex_id: string
}

export interface ITree {
    id: string
    number: string;
    commonName: string;
    specie_id: string;
    range: number
    scientificName: string;
    dap: number;
    meters: number;
    autex?: any;
    volumeM3: number
    sVolumeM3: number;

}

export interface ITreeWithSections extends ITree {
    sections: ISection[]

}

