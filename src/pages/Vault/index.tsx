import React, { memo, useEffect } from 'react'
import { VaultWrapper, VaultTitle, Title, VaultContent } from './styled'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default memo(function VaultPage() {
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <VaultWrapper>
      <VaultTitle>
        <Title>
          <Link to={'/vault'}>{t('vault.title')}</Link>
        </Title>
      </VaultTitle>
      <VaultContent>
        <div className="span">
          {t('vault.title.1')} <br />
          <span>{t('vault.title.2')}</span>
        </div>
      </VaultContent>
    </VaultWrapper>
  )
})
