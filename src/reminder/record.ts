import {
  array,
  check,
  type InferOutput,
  maxLength,
  nullable,
  number,
  object,
  optional,
  pipe,
  regex,
  startsWith,
  string,
  url,
} from 'valibot'
import { isIsoDate } from '../domain/logicalDay'

const MAX_KEY_LENGTH = 256

const MAX_ENDPOINT_LENGTH = 1024

const MAX_TIME_ZONE_LENGTH = 64

const MAX_SKIP_NIGHTS = 400

const PUSH_ENDPOINT_SCHEME = 'https://'

const QUARTER_HOUR_TIME = /^([01]\d|2[0-3]):(00|15|30|45)$/

const isoDateSchema = pipe(string(), check(isIsoDate))

const keySchema = pipe(string(), maxLength(MAX_KEY_LENGTH))

export const pushSubscriptionSchema = object({
  endpoint: pipe(string(), url(), startsWith(PUSH_ENDPOINT_SCHEME), maxLength(MAX_ENDPOINT_LENGTH)),
  expirationTime: optional(nullable(number())),
  keys: object({ p256dh: keySchema, auth: keySchema }),
})

export const reminderRecordSchema = object({
  subscription: pushSubscriptionSchema,
  time: pipe(string(), regex(QUARTER_HOUR_TIME)),
  timeZone: pipe(string(), maxLength(MAX_TIME_ZONE_LENGTH)),
  completeDate: nullable(isoDateSchema),
  skipNights: pipe(array(isoDateSchema), maxLength(MAX_SKIP_NIGHTS)),
})

export const endpointOnlySchema = object({ endpoint: pushSubscriptionSchema.entries.endpoint })

export type ReminderRecord = InferOutput<typeof reminderRecordSchema>
