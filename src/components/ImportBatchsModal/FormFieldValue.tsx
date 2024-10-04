export type FormFieldValues = {
    tree: {
        number: number;
        dap: number;
        meters: number;
        range: number;
        specie_id: string | null;
        scientificName: string;
        commonName: string;
        volumeM3: number
        sections: {
            scientificName: string;
            plate: string;
            commonName: string;
            number: number;
            section: string;
            d1: number;
            d2: number;
            d3: number;
            d4: number;
            meters: number;
            volumeM3: number;
        }[]
    }[];

};
