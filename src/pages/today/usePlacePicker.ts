import { useIonActionSheet, useIonAlert } from '@ionic/react'
import { COMMON_COPY } from '../../copy/common'
import { setPlace } from '../../data/repo'
import type { Prayer } from '../../domain/types'
import { TODAY_COPY } from './copy'

const PLACE_INPUT = 'place'

const isPlaceInput = (values: unknown): values is { [PLACE_INPUT]: string } =>
  typeof values === 'object' && values !== null && PLACE_INPUT in values && typeof values[PLACE_INPUT] === 'string'

export function usePlacePicker(date: string, prayer: Prayer, knownPlaces: string[]) {
  const [presentSheet] = useIonActionSheet()
  const [presentAlert] = useIonAlert()

  const choose = (place: string | null) => void setPlace(date, prayer, place)

  const askNewPlace = () =>
    void presentAlert({
      header: TODAY_COPY.newPlaceHeader,
      inputs: [
        {
          name: PLACE_INPUT,
          type: 'text',
          placeholder: TODAY_COPY.placeName,
          attributes: { 'aria-label': TODAY_COPY.placeName },
        },
      ],
      buttons: [
        { text: COMMON_COPY.cancel, role: 'cancel' },
        {
          text: TODAY_COPY.save,
          handler: (values) => {
            const name = isPlaceInput(values) && values[PLACE_INPUT].trim()

            if (name) {
              choose(name)
            }
          },
        },
      ],
    })

  return (current?: string) =>
    void presentSheet({
      header: TODAY_COPY.placeSheet(COMMON_COPY.prayers[prayer]),
      buttons: [
        ...knownPlaces.map((place) => ({
          text: place,
          ...(place === current && { role: 'selected' }),
          handler: () => choose(place),
        })),
        { text: TODAY_COPY.newPlace, handler: askNewPlace },
        ...(current ? [{ text: TODAY_COPY.noPlace, role: 'destructive', handler: () => choose(null) }] : []),
        { text: COMMON_COPY.cancel, role: 'cancel' },
      ],
    })
}
