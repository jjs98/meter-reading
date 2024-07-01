import { EasyNetworkStub } from 'easy-network-stub';

import { MeterStubs } from './stubs/meter.stubs';
import { EasyNetworkStubGroup, EasyNetworkStubWrapper, EasyNetworkStubWrapperOptions, StubRequestItem, createEasyNetworkStubGroup } from './utils/easy-network-stub.utils';

export { MeterStubs } from './stubs/meter.stubs';


export class ApiStubs {
  private readonly _stubWrapper: EasyNetworkStubWrapper;
  private _meter?: EasyNetworkStubGroup<MeterStubs, this>;

  constructor(stub: EasyNetworkStub, options?: Partial<EasyNetworkStubWrapperOptions>) {
    this._stubWrapper = new EasyNetworkStubWrapper(stub, options);
  }

  public get requests(): readonly (StubRequestItem)[] {
    return this._stubWrapper.requests;
  }
  public get meter(): EasyNetworkStubGroup<MeterStubs, this> {
    return this._meter ??= createEasyNetworkStubGroup(this, this._stubWrapper, MeterStubs);
  }

  public resetStubs(): this {
    this._meter?.reset();
    return this;
  }
}
