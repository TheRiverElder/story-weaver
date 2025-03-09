export default class HostedComponentBase<THost = any> {
    
    private _host?: THost;
    public get host(): THost {
        const host = this._host;
        if (host) return host;
        throw new Error('The component is not attached to a host.');
    }

    public onAddToHost(host: THost) {
        // Called when the component is added to the host.
        this._host = host;
    }

    public onRemoveFromHost() {
        // Called when the component is removed from the host.
        this._host = undefined;
    }
}