
export interface ICreateTree {
    number: number;
    commonName: string;
    scientificName: string;
    dap: number;
    range: number
    meters: number;
    volumeM3: number
}

export interface ITree {
    id: string | null
    number: number;
    commonName: string;
    range: number
    scientificName: string;
    dap: number;
    meters: number;
    volumeM3: number
}
