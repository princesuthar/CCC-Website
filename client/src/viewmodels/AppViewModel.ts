import type { AppModel } from '../models/AppModel'

export const appViewModel = (): AppModel => {
  return {
    applicationName: 'Core Coding Committee',
    version: '1.0.0',
  }
}