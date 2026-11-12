import { type ReactNode, useState } from 'react'
import type { StarState, StreakLink } from '../domain/stars'
import './StarChart.css'

export interface StarChartLine {
  id: string
  label: string
  spokenName?: string
  stars: StarState[]
  links: StreakLink[]
}

export interface StarChartColumn {
  date: string
  head: ReactNode
  isToday: boolean
  isShown?: boolean
  isDimmed?: boolean
  spokenName?: string
}

function columnClassName({ isToday, isShown, isDimmed }: StarChartColumn) {
  const ring = isToday ? ' is-today today-ring' : isShown ? ' is-shown shown-ring' : ''

  return `star-column${ring}${isDimmed ? ' is-dimmed' : ''}`
}

interface StarChartProps {
  columns: StarChartColumn[]
  lines: StarChartLine[]
  onOpenDay?: (date: string) => void
  stampsNewStars?: boolean
}

function Star({ state, stamps }: { state: StarState; stamps: boolean }) {
  const [previous, setPrevious] = useState(state)
  const [stamping, setStamping] = useState(false)

  if (state !== previous) {
    setPrevious(state)
    setStamping(stamps && state === 'done')
  }

  return (
    <span className="star-cell">
      <i className={`star star-${state}${stamping ? ' star-stamp' : ''}`} onAnimationEnd={() => setStamping(false)} />
    </span>
  )
}

const PERCENT = 100

const positionFromStart = (index: number, count: number) => Math.min(Math.max(index + 0.5, 0), count) / count

function linkStyle({ from, to }: StreakLink, lineIndex: number, count: number) {
  const start = positionFromStart(from, count)

  return {
    insetInlineStart: `${start * PERCENT}%`,
    width: `${(positionFromStart(to, count) - start) * PERCENT}%`,
    top: `calc(var(--chart-head) + ${lineIndex + 0.5} * var(--chart-row))`,
  }
}

interface LineLinksProps {
  line: StarChartLine
  lineIndex: number
  count: number
  drawsNewLinks: boolean
}

function LineLinks({ line, lineIndex, count, drawsNewLinks }: LineLinksProps) {
  const lastColumn = count - 1
  const last = line.stars[lastColumn]
  const [previous, setPrevious] = useState(last)
  const [drawing, setDrawing] = useState(false)

  if (last !== previous) {
    setPrevious(last)
    setDrawing(drawsNewLinks && last === 'done')
  }

  return line.links.map((link) => (
    <i
      key={link.from}
      className={`streak-link${drawing && link.to === lastColumn ? ' streak-link-new' : ''}`}
      style={linkStyle(link, lineIndex, count)}
      onAnimationEnd={() => setDrawing(false)}
    />
  ))
}

export function StarChart({ columns, lines, onOpenDay, stampsNewStars = false }: StarChartProps) {
  const count = columns.length
  const lastColumn = count - 1

  return (
    <div className="star-chart">
      <div className="star-chart-labels">
        {lines.map((line) => (
          <span
            key={line.id}
            role={line.spokenName ? 'img' : undefined}
            aria-label={line.spokenName}
            aria-hidden={line.spokenName ? undefined : true}
          >
            {line.label}
          </span>
        ))}
      </div>
      <div className="star-chart-plot">
        <div className="star-chart-links" aria-hidden="true">
          {lines.map((line, lineIndex) => (
            <LineLinks key={line.id} line={line} lineIndex={lineIndex} count={count} drawsNewLinks={stampsNewStars} />
          ))}
        </div>
        {columns.map((column, columnIndex) => {
          const className = columnClassName(column)

          const cells = (
            <>
              <span className="star-column-head">{column.head}</span>
              {lines.map((line) => (
                <Star
                  key={line.id}
                  state={line.stars[columnIndex]}
                  stamps={stampsNewStars && columnIndex === lastColumn}
                />
              ))}
            </>
          )

          return onOpenDay ? (
            <button
              key={column.date}
              type="button"
              className={className}
              aria-label={column.spokenName}
              disabled={column.isDimmed}
              onClick={() => onOpenDay(column.date)}
            >
              <span aria-hidden="true" className="star-column-inner">
                {cells}
              </span>
            </button>
          ) : (
            <div key={column.date} className={className} aria-hidden="true">
              <span className="star-column-inner">{cells}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
