export interface Man {
    id: string;
    name: string;
}

export interface Family {
    id: string;
    name: string;
    //man.id
    members: string[];
}

export interface Spending {
    id: string;
    name: string;
    spent: number;
    //man.id
    payedBy: string[];
    //man.id
    users: string[];
}
