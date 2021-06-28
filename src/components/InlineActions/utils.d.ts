export declare type ActionProps = {
    stateId: any;
    viewId: string | null;
};
declare let popper: {
    update: () => void;
} | null;
export declare function registerPopper(next: typeof popper): void;
export declare function positionPopper(): void;
export {};
