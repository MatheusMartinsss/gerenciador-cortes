

export interface ICompany {
    id: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: string;
    email?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}