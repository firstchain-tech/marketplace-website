import React, { memo, useEffect } from 'react'
import { GovernanceContent, GovernanceTitle, Title, GovernanceWrapper } from './styled'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default memo(function TreasuryPage() {
  const { t } = useTranslation()

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GovernanceWrapper>
      <GovernanceTitle>
        <Title>
          <Link to={'/governance'}>{t('governance.title')}</Link>
        </Title>
      </GovernanceTitle>
      <GovernanceContent>
        <div className="span">
          {t('governance.title.1')} <br />
          <span>{t('governance.title.2')}</span>
        </div>
      </GovernanceContent>
    </GovernanceWrapper>
  )
})
