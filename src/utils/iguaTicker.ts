import {Ticker, settings} from "pixi.js";

export class EscapeTickerAndExecute
{
    public readonly execute: () => void;

    constructor(execute: () => void) {
        this.execute = execute;
    }
}

type IguaTickerFn = () => void;

export class IguaTicker extends Ticker
{
    private readonly _callbacks: IguaTickerFn[] = [];
    private _callbacksToRemove: IguaTickerFn[] = [];

    add(fn: (...params: any[]) => any, context?: any, priority?: number): this
    {
        this._callbacks.push(fn);
        return this;
    }

    addOnce(fn: (...params: any[]) => any, context?: any, priority?: number): this
    {
        throw new Error("Not implemented!");
    }

    remove(fn: (...params: any[]) => any, context?: any): this
    {
        this._callbacksToRemove.push(fn);
        return this;
    }

    destroy()
    {
        throw new Error("Not implemented!");
    }

    update(currentTime?: number): void {
        try
        {
            this.updateImpl();
        }
        catch (e)
        {
            if (e instanceof EscapeTickerAndExecute) {
                e.execute();
                return;
            }
            console.error(`Unhandled error in IguaTicker.update: ${e}`);
        }
    }

    private updateImpl(): void
    {
        for (let i = 0, len = this._callbacksToRemove.length; i < len; i++)
            this._callbacks.remove(this._callbacksToRemove[i]);

        for (let i = 0, len = this._callbacks.length; i < len; i++)
        {
            const callback = this._callbacks[i];

            try
            {
                callback();
            }
            catch (e)
            {
                if (e instanceof EscapeTickerAndExecute)
                    throw e;
                console.error(`Unhandled error while emitting listener`, callback, e);
            }
        }
    }
}