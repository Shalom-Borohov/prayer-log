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
} from '@ionic/react'
import { downloadOutline, shareOutline } from 'ionicons/icons'
import { type ChangeEvent, useRef } from 'react'
import { BACKUP_FILE_ACCEPT, readBackup } from '../../backup/backupFile'
import { saveLastBackup, useLastBackup } from '../../backup/lastBackup'
import { useExportBackup } from '../../backup/useExportBackup'
import { COMMON_COPY } from '../../copy/common'
import { type Backup, restoreBackup } from '../../data/backup'
import { dateTimeLabel } from '../../domain/format'
import { useSave } from '../../hooks/useSave'
import { useToast } from '../../hooks/useToast'
import { type Tab, tabPath } from '../../navigation/paths'
import { SETTINGS_COPY } from './copy'
import { FeedbackSettings } from './FeedbackSettings'
import { VersionSettings } from './VersionSettings'

export function SettingsPage({ tab }: { tab: Tab }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [presentAlert] = useIonAlert()
  const { toast, toastError } = useToast()
  const save = useSave()
  const exportData = useExportBackup()
  const lastBackup = useLastBackup()

  async function restore(backup: Backup) {
    if (await save(restoreBackup(backup))) {
      saveLastBackup(backup.exportedAt)
      void toast(SETTINGS_COPY.backupRestored)
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
      void toastError(error)
    }
  }

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={tabPath(tab)} text={COMMON_COPY[tab]} />
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
            <IonLabel>{COMMON_COPY.exportBackup}</IonLabel>
          </IonItem>
          <IonItem button detail={false} onClick={() => fileInput.current?.click()}>
            <IonIcon slot="start" color="primary" icon={downloadOutline} />
            <IonLabel>{SETTINGS_COPY.importBackup}</IonLabel>
          </IonItem>
        </IonList>
        <IonNote className="list-footer">
          {lastBackup === null ? COMMON_COPY.noBackupYet : SETTINGS_COPY.lastBackup(dateTimeLabel(lastBackup))}
        </IonNote>
        <IonNote className="list-footer">{SETTINGS_COPY.storageNote}</IonNote>
        <FeedbackSettings />
        <VersionSettings />
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
