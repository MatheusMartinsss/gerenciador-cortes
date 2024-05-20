import { ITree } from "./tree";
import { ISection } from './section'

export interface ICreateSpecie {
    commonName: string;
    scientificName: string;

}

export interface ISpecie {
    id: string
    commonName: string;
    scientificName: string;
    trees: ITree[] | []
    sections: ISection[] | []
    volumeM3: number;
    sectionsVolumeM3: number;
}
