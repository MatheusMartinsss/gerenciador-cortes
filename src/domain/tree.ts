import { ISection } from "./section";

export interface ICreateTree {
    specie_id: string;
    number: number;
    commonName: string;
    scientificName: string;
    dap: number;
    range: number
    meters: number;
    volumeM3: number
}

export interface ITree {
    id: string
    number: number;
    commonName: string;
    specie_id: string;
    range: number
    scientificName: string;
    dap: number;
    meters: number;
    volumeM3: number
    sectionsVolumeM3: number;

}

export interface ITreeWithSections extends ITree {
    sections: ISection[]

}

