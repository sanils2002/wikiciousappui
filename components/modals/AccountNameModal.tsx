import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import mangoStore from '../../store/state'
import { notify } from '../../utils/notifications'
import Button from '../shared/Button'
import { useTranslation } from 'next-i18next'
import { ChangeEvent, useState } from 'react'
import BounceLoader from '../shared/BounceLoader'
import Input from '../forms/Input'
import Label from '../forms/Label'

const AccountNameModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation('common')
  const mangoAccount = mangoStore((s) => s.mangoAccount.current)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(mangoAccount?.name || '')

  // This doesn't work yet...
  const handleUpdateccountName = async () => {
    const client = mangoStore.getState().client
    const group = mangoStore.getState().group
    if (!mangoAccount || !group) return
    setLoading(true)
    try {
      const tx = await client.editMangoAccount(group, mangoAccount, name)
      if (tx) {
        setLoading(false)
        onClose()
        notify({
          title: t('account-update-success'),
          type: 'success',
          txid: tx,
        })
      }
    } catch (e) {
      setLoading(false)
      notify({
        title: t('account-update-failed'),
        type: 'error',
      })
      console.log(e)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="h-64">
        {loading ? (
          <BounceLoader loadingMessage={t('updating-account-name')} />
        ) : (
          <div className="flex h-full flex-col justify-between">
            <div className="pb-4">
              <h2 className="mb-1">{t('edit-account')}</h2>
              <p className="mb-4">{t('account-name-desc')}</p>
              <Label text={t('account-name')} />
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="0.00"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
            <Button
              className="w-full"
              onClick={handleUpdateccountName}
              size="large"
            >
              {t('update')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AccountNameModal
