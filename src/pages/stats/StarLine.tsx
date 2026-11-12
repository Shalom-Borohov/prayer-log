import type { CSSProperties } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { STATS_COPY } from './copy'
import type { LineStar, StarLineModel, StarMark } from './lineStars'
import '../../components/StarChart.css'
import './starLine.css'

type StarLineStyle = CSSProperties & Partial<Record<'--star-count' | '--star-scale', number>>

function Mark({ mark }: { mark: StarMark }) {
  if (mark.kind === 'none') {
    return null
  }

  if (mark.kind === 'plus') {
    return <i className="star-unmarked" />
  }

  const style: StarLineStyle = { '--star-scale': mark.scale }

  return <i className="star-line-disc" style={style} />
}

function Star({ star }: { star: LineStar }) {
  const className = `star-line-star${star.isToday ? ' is-today' : ''}`
  const name = star.spokenName

  return (
    <span className={className}>
      <span role={name ? 'img' : undefined} aria-label={name} aria-hidden={name ? undefined : true}>
        <span className={`star-line-box${star.isToday ? ' today-ring' : ''}`}>
          <Mark mark={star.mark} />
        </span>
      </span>
      <span className="star-line-label" aria-hidden="true">
        {star.label}
      </span>
    </span>
  )
}

export function StarLine({ line }: { line: StarLineModel }) {
  const isSilent = line.stars.every((star) => star.spokenName === undefined)
  const style: StarLineStyle = { '--star-count': line.stars.length }

  return (
    <div className="star-line" role="group" aria-label={STATS_COPY.trendHeading[line.unit]}>
      <div className="star-line-stars" style={style}>
        {line.stars.map((star) => (
          <Star key={star.key} star={star} />
        ))}
        {isSilent && <span className="star-line-silent" role="img" aria-label={COMMON_COPY.noData} />}
      </div>
    </div>
  )
}
