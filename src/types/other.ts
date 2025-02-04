export interface IPermission {
    endpoint: string;
    access: string[];
}

export interface IKey {
    key: string;
    permissions: IPermission[];
}