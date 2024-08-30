export type FormFieldValues = {
    specie: {
        id?: string | null
        commonName: string;
        scientificName: string
        trees: {
            number: number;
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
