export type FormFieldValues = {
    tree: {
        id: string;
        number: number;
        dap: number;
        range: number;
        scientificName: string;
        commonName: string;
        volumeM3: number
        sectionsVolumeM3: number;
        section?: {
            tree_id: string;
            section: string;
            number: number;
            d1: number;
            d2: number;
            d3: number;
            d4: number;
            meters: number;
            volumeM3: number;
        }[];
    }[];
};
