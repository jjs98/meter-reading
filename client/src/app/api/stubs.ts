import { EasyNetworkStub } from 'easy-network-stub';

import { AuthStubs } from './stubs/auth.stubs';
import { MeterStubs } from './stubs/meter.stubs';
import { ReadingStubs } from './stubs/reading.stubs';
import { RoleStubs } from './stubs/role.stubs';
import { UserRoleStubs } from './stubs/user-role.stubs';
import { UserStubs } from './stubs/user.stubs';
import { EasyNetworkStubWrapper, createEasyNetworkStubGroup } from './utils/easy-network-stub.utils';

import type { EasyNetworkStubGroup, EasyNetworkStubWrapperOptions, StubRequestItem } from './utils/easy-network-stub.utils';

export { AuthStubs } from './stubs/auth.stubs';
export { MeterStubs } from './stubs/meter.stubs';
export { ReadingStubs } from './stubs/reading.stubs';
export { RoleStubs } from './stubs/role.stubs';
export { UserRoleStubs } from './stubs/user-role.stubs';
export { UserStubs } from './stubs/user.stubs';


export class ApiStubs {
  private readonly _stubWrapper: EasyNetworkStubWrapper;
  private _auth?: EasyNetworkStubGroup<AuthStubs, this>;
  private _meter?: EasyNetworkStubGroup<MeterStubs, this>;
  private _reading?: EasyNetworkStubGroup<ReadingStubs, this>;
  private _role?: EasyNetworkStubGroup<RoleStubs, this>;
  private _user?: EasyNetworkStubGroup<UserStubs, this>;
  private _userRole?: EasyNetworkStubGroup<UserRoleStubs, this>;

  constructor(stub: EasyNetworkStub, options?: Partial<EasyNetworkStubWrapperOptions>) {
    this._stubWrapper = new EasyNetworkStubWrapper(stub, options);
  }

  public get requests(): readonly (StubRequestItem)[] {
    return this._stubWrapper.requests;
  }
  public get auth(): EasyNetworkStubGroup<AuthStubs, this> {
    return this._auth ??= createEasyNetworkStubGroup(this, this._stubWrapper, AuthStubs);
  }
  public get meter(): EasyNetworkStubGroup<MeterStubs, this> {
    return this._meter ??= createEasyNetworkStubGroup(this, this._stubWrapper, MeterStubs);
  }
  public get reading(): EasyNetworkStubGroup<ReadingStubs, this> {
    return this._reading ??= createEasyNetworkStubGroup(this, this._stubWrapper, ReadingStubs);
  }
  public get role(): EasyNetworkStubGroup<RoleStubs, this> {
    return this._role ??= createEasyNetworkStubGroup(this, this._stubWrapper, RoleStubs);
  }
  public get user(): EasyNetworkStubGroup<UserStubs, this> {
    return this._user ??= createEasyNetworkStubGroup(this, this._stubWrapper, UserStubs);
  }
  public get userRole(): EasyNetworkStubGroup<UserRoleStubs, this> {
    return this._userRole ??= createEasyNetworkStubGroup(this, this._stubWrapper, UserRoleStubs);
  }

  public resetStubs(): this {
    this._auth?.reset();
    this._meter?.reset();
    this._reading?.reset();
    this._role?.reset();
    this._user?.reset();
    this._userRole?.reset();
    return this;
  }
}
