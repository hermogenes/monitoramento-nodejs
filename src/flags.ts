import {OpenFeature} from '@openfeature/server-sdk'
import {FlagdProvider} from '@openfeature/flagd-provider'

OpenFeature.setProvider(new FlagdProvider({resolverType: 'in-process'}))

export const flagClient = OpenFeature.getClient()
