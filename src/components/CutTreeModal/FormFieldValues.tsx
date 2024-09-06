export type FormFieldValues = {
    description: string,
    tree: {
        id: string;
        number: number;
        dap: number;
        range: number;
        scientificName: string;
        specie_id: string;
        commonName: string;
        volumeM3: number
        sVolumeM3: number;
        cutVolM3: number;
        section?: {
            tree_id: string;
            section: string;
            plate: string;
            specie_id: string;
            d1: number;
            d2: number;
            d3: number;
            d4: number;
            meters: number;
            volumeM3: number;
        }[];
    }[];
};
