// stateman.ts
import { useEffect, useState } from 'react';
import { EventTarget } from 'event-target-shim';
function makeHandler(events) {
    return {
        get(target, prop, receiver) {
            const val = Reflect.get(target, prop, receiver);
            if (val && typeof val === 'object') {
                // Handle nested objects and arrays with the same proxy
                return new Proxy(val, makeHandler(events));
            }
            return val;
        },
        set(target, prop, value, receiver) {
            const prev = target[prop];
            const ok = Reflect.set(target, prop, value, receiver);
            if (prev !== value) {
                events.dispatchEvent(new Event('change'));
            }
            return ok;
        },
        deleteProperty(target, prop) {
            const ok = Reflect.deleteProperty(target, prop);
            events.dispatchEvent(new Event('change'));
            return ok;
        }
    };
}
export class Model {
    get state() {
        return this._state;
    }
    constructor(initialState) {
        const stateEventTarget = new EventTarget();
        this._state = new Proxy(initialState, makeHandler(stateEventTarget));
        this._stateEventTarget = stateEventTarget;
    }
    subscribe(fn) {
        this._stateEventTarget.addEventListener('change', () => {
            fn();
        });
        return () => this._stateEventTarget.removeEventListener('change', fn);
    }
}
export function useController(ctrl) {
    // This preserves the reference to the controller.
    const [ctrl$, setState] = useState(ctrl);
    // This re-renders the component when the state changes, without requiring state be compared.
    // We already know state has changed, because we're using a proxy. React can determine what has changed.
    const [tick, setTick] = useState(0);
    useEffect(() => ctrl$.subscribe(() => setTick((t) => t + 1)), [ctrl$]);
    return ctrl$;
}
