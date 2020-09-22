export interface Man {
    id: string;
    name: string;
}

export interface Family {
    id: string;
    name: string;
    members: Man[];
}

export interface Spending {
    id: string;
    name: string;
    spent: number;
    payedBy: Man[];
    users: Man[];
}
