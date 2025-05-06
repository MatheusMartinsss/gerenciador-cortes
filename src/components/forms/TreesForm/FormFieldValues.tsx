export type FormFieldValues = {
    autex_id: string;
    specie: {
        id: string | null
        commonName: string;
        scientificName: string
        trees: {
            number: string;
            dap: number;
            meters: number;
            range: number;
            specie_id: string | null;
            scientificName: string;
            commonName: string;
            volumeM3: number
        }[];
    }[]
};
