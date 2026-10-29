import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from '@ionic/react'
import { downloadOutline, shareOutline } from 'ionicons/icons'
import { type ChangeEvent, useRef } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { type Backup, exportBackup, restoreBackup } from '../../data/backup'
import { LIST_SEPARATOR, fullDateLabel } from '../../domain/format'
import { toIsoDate } from '../../domain/logicalDay'
import { STATS_PATH } from '../../navigation/paths'
import { BACKUP_FILE_ACCEPT, isShareCancel, readBackup, shareBackup } from './backupFile'
import { SETTINGS_COPY } from './copy'

const TOAST_DURATION_MS = 2500

const versionLine = [
  SETTINGS_COPY.version(__APP_COMMIT__),
  SETTINGS_COPY.updated(fullDateLabel(toIsoDate(new Date(__APP_BUILT_AT__)))),
].join(LIST_SEPARATOR)

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : SETTINGS_COPY.actionFailed)

export function SettingsPage() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [presentAlert] = useIonAlert()
  const [presentToast] = useIonToast()

  const toast = (message: string) => presentToast({ message, duration: TOAST_DURATION_MS, position: 'top' })

  async function exportData() {
    try {
      await shareBackup(await exportBackup(Date.now()))
    } catch (error) {
      if (!isShareCancel(error)) {
        void toast(errorMessage(error))
      }
    }
  }

  async function restore(backup: Backup) {
    try {
      await restoreBackup(backup)
      void toast(SETTINGS_COPY.backupRestored)
    } catch (error) {
      void toast(errorMessage(error))
    }
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]

    input.value = ''

    if (!file) {
      return
    }

    try {
      const backup = await readBackup(file)

      presentAlert({
        header: SETTINGS_COPY.importBackup,
        message: SETTINGS_COPY.importWarning,
        buttons: [
          { text: COMMON_COPY.cancel, role: 'cancel' },
          { text: SETTINGS_COPY.confirmImport, role: 'destructive', handler: () => void restore(backup) },
        ],
      })
    } catch (error) {
      void toast(errorMessage(error))
    }
  }

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={STATS_PATH} text={COMMON_COPY.stats} />
          </IonButtons>
          <IonTitle>{COMMON_COPY.settings}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader>
          <IonLabel>{SETTINGS_COPY.backup}</IonLabel>
        </IonListHeader>
        <IonList inset>
          <IonItem button detail={false} onClick={exportData}>
            <IonIcon slot="start" color="primary" icon={shareOutline} />
            <IonLabel>{SETTINGS_COPY.exportBackup}</IonLabel>
          </IonItem>
          <IonItem button detail={false} onClick={() => fileInput.current?.click()}>
            <IonIcon slot="start" color="primary" icon={downloadOutline} />
            <IonLabel>{SETTINGS_COPY.importBackup}</IonLabel>
          </IonItem>
        </IonList>
        <IonNote className="list-footer">{SETTINGS_COPY.storageNote}</IonNote>
        <IonNote className="list-footer">{versionLine}</IonNote>
        <input
          ref={fileInput}
          type="file"
          accept={BACKUP_FILE_ACCEPT}
          hidden
          aria-label={SETTINGS_COPY.backupFile}
          onChange={importFile}
        />
      </IonContent>
    </IonPage>
  )
}
