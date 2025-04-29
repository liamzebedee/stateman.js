type Subscriber = () => void;
export interface AsyncResult<T> {
    status: "idle" | "pending" | "success" | "error";
    data: T | null;
    error: Error | null;
}
export declare class Model<T extends object> {
    protected _state: T;
    private _stateEventTarget;
    get state(): T;
    constructor(initialState: T);
    subscribe(fn: Subscriber): () => void;
}
export declare function useController<T extends Model<any>>(ctrl: T): T;
export {};
