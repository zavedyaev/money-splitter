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

export interface Summary {
    rows: (SummaryRowMan | SummaryRowFamily)[];
}

export interface SummaryRow {
    paid: number;
    used: number;
    difference: number;
}

export interface SummaryRowMan extends SummaryRow {
    manId: string;
}

export interface SummaryRowFamily extends SummaryRow {
    familyId: string;
    summaryForMembers: SummaryRowMan[]
}

export interface OptimizedTransactions {
    debtorManOrFamilyName: string;
    creditorManOrFamilyName: string;
    debt: number
}