import type { ReactNode } from 'react'
import { COMMON_COPY } from '../copy/common'
import type { ShelfRow } from '../domain/shelf'
import { Spine } from './Spine'
import './WeekShelves.css'

export interface WeekShelvesColumn {
  date: string
  head: ReactNode
  isToday: boolean
  isDimmed: boolean
  spokenName: string
}

interface WeekShelvesProps {
  columns: WeekShelvesColumn[]
  rows: ShelfRow[]
  onOpenDay: (date: string) => void
}

const HEAD_ROWS = 1
const LABEL_COLUMNS = 1

const shelfGridRow = (rowIndex: number) => HEAD_ROWS + rowIndex + 1

function columnClassName({ isToday, isDimmed }: WeekShelvesColumn) {
  return `week-shelves-day${isToday ? ' is-today' : ''}${isDimmed ? ' is-dimmed' : ''}`
}

export function WeekShelves({ columns, rows, onOpenDay }: WeekShelvesProps) {
  return (
    <div className="week-shelves" style={{ gridTemplateRows: `var(--week-head) repeat(${rows.length}, var(--week-row))` }}>
      {rows.map((row, rowIndex) => (
        <span
          key={row.key}
          className="week-shelves-label"
          style={{ gridRow: shelfGridRow(rowIndex) }}
          aria-hidden="true"
        >
          {COMMON_COPY.tracks[row.key]}
        </span>
      ))}
      {rows.map((row, rowIndex) => (
        <i key={row.key} className="week-shelves-board" style={{ gridRow: shelfGridRow(rowIndex) }} aria-hidden="true" />
      ))}
      {columns.map((column, columnIndex) => (
        <button
          key={column.date}
          type="button"
          className={columnClassName(column)}
          style={{ gridColumn: LABEL_COLUMNS + columnIndex + 1 }}
          aria-label={column.spokenName}
          disabled={column.isDimmed}
          onClick={() => onOpenDay(column.date)}
        >
          <span aria-hidden="true" className="week-shelves-column">
            <span className="week-shelves-head">{column.head}</span>
            {rows.map((row) => (
              <span key={row.key} className={`week-shelves-cell hue-${row.key}`}>
                <Spine state={row.slots[columnIndex]} />
              </span>
            ))}
          </span>
        </button>
      ))}
    </div>
  )
}
