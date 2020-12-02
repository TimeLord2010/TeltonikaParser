export interface IavlDict {
    [id: number]: string | {
        TableName?: string | number;
        AVL_Name: string;
    };
}
