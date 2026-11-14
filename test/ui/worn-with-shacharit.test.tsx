import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { markIn } from '../helpers/dayRows'
import { renderAt } from '../helpers/renderAt'

const wednesday = new Date(2026, 9, 28, 10).getTime()

const wornCheck = async (name: 'תפילין' | 'טלית') =>
  within(await screen.findByRole('group', { name: 'תפילין וטלית' })).getByRole('checkbox', { name })

describe('marking שחרית on היום', () => {
  beforeEach(resetDb)
  freezeDate(wednesday)

  it('checks תפילין and טלית, and clearing it unchecks them', async () => {
    renderAt('/tabs/today')

    await markIn('שחרית', 'ביחידות')

    await waitFor(async () => expect(await wornCheck('תפילין')).toHaveAttribute('aria-checked', 'true'))
    expect(await wornCheck('טלית')).toHaveAttribute('aria-checked', 'true')

    await markIn('שחרית', 'ביחידות')

    await waitFor(async () => expect(await wornCheck('תפילין')).toHaveAttribute('aria-checked', 'false'))
    expect(await wornCheck('טלית')).toHaveAttribute('aria-checked', 'false')
  })
})
