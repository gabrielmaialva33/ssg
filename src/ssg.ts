import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'
import { getServerAddress } from './datacenters'

export interface Handlers {
  code: () => Promise<string>
  password: (hint?: string) => Promise<string>
  error: (err: Error) => Promise<boolean>
}

export class SSG {
  private client: TelegramClient

  constructor(
    appId: string,
    appHash: string,
    private number: string
  ) {
    this.client = new TelegramClient(new StringSession(), Number(appId), appHash, {})
  }

  private _stringSession?: string

  get stringSession() {
    if (this._stringSession) {
      return this._stringSession
    }

    this.client.session.setDC(
      this.client.session.dcId,
      getServerAddress(this.client.session.dcId),
      this.client.session.port
    )

    this._stringSession = this.client.session.save() as unknown as any
    return this._stringSession
  }

  async start(handlers: Handlers) {
    return this.client.start({
      phoneNumber: this.number,
      phoneCode: handlers.code,
      password: handlers.password,
      onError: handlers.error,
    })
  }

  sendString() {
    return this.client.sendMessage('me', {
      message: `-----BEGIN STRING SESSION-----\n${this.stringSession}\n-----END STRING SESSION-----`,
    })
  }

  destroy() {
    this._stringSession = undefined
    return this.client.destroy()
  }
}
