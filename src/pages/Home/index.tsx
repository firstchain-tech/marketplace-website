import React, { memo, useEffect, useState } from 'react'
import { Button, Image } from 'antd'
import {
  HomeWrapper,
  IntroduceDiv,
  IntroduceTitle,
  IntroduceSpan,
  IntroduceList,
  ListInfo,
  AboutDiv,
  AboutDivContent,
  AboutTitle,
  ImageDiv,
} from './styled'
import { scrollToAnchor } from '@/utils'
import TopBar from '@/components/TopBar'
import TweenOne from 'rc-tween-one'
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack'
import QueueAnim from 'rc-queue-anim'
import { useTranslation } from 'react-i18next'
import { useHomeHooks } from '@/hooks/useHomeHooks'
import BANNER from '@/assets/banner.png'
import { Link } from 'react-router-dom'

export default memo(function HomePages(pages: any) {
  const [spend, setSpend] = useState<number>(0)
  const { t } = useTranslation()

  const { homeList } = useHomeHooks()

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    window.scrollTo(0, 0)
    return () => window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let hash = pages.location.hash
    if (hash.length > 0) {
      let str = hash.substr(1)
      scrollToAnchor(str)
      // window.scrollTo(0, document.body.scrollHeight)
    } else {
      window.scrollTo(0, 0)
    }
    return () => {
      window.scrollTo(0, 0)
      setSpend(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages])

  const handleScroll = (e: any) => {
    const scrollTop =
      (e.srcElement ? e.srcElement.documentElement.scrollTop : false) ||
      window.pageYOffset ||
      (e.srcElement ? e.srcElement.body.scrollTop : 0)
    let transparency = scrollTop / 500 > 1 ? 1 : (scrollTop / 500).toFixed(2)
    setSpend(Number(transparency))
  }

  return (
    <HomeWrapper>
      <TopBar background={`rgba(255,255,255,${spend})`} borderBottom={`1px solid rgba(229, 229, 229,${spend})`}></TopBar>
      {/* banner */}
      <Image src={BANNER} width="100%" preview={false} />
      {/* <Banner>
        <Button
          className="HomeBannerTitle"
          title={t('home.open.tips')}
          onClick={() => {
            message.info({
              content: t('home.open.tips'),
              className: 'message-global',
            })
          }}
        >
          {t('home.banner.tips')}
        </Button>
      </Banner> */}

      {/* introduce */}
      <OverPack playScale={[0.3, 0.7]}>
        <IntroduceDiv id="scrollIntroduce">
          <QueueAnim leaveReverse delay={[0, 100]}>
            <IntroduceTitle key="nft">
              {t('home.nft.title1')}
              <span>&nbsp;NFT&nbsp;</span>
              {t('home.nft.title2')}
            </IntroduceTitle>
          </QueueAnim>
          <QueueAnim
            delay={100}
            type="bottom"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
          >
            <IntroduceSpan key="span">{t('home.nft.vice.title')}</IntroduceSpan>
            <Link to="/market">
              <Button className="IntroduceA" key="a">
                {t('home.nft.check')}
              </Button>
            </Link>
          </QueueAnim>
          <QueueAnim type="left" key="img" delay={200} className="h5-anim">
            <IntroduceList>
              {homeList.map((item, i) => (
                <TweenOne key={i.toString()} animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: i * 100 + 400 }}>
                  <ListInfo>
                    <ImageDiv>
                      <img src={item.cover || item.image} alt={item.name} />
                    </ImageDiv>
                    <span>{item.isDefault ? `${item.name}${item.tokenId}` : item.name}</span>
                  </ListInfo>
                </TweenOne>
              ))}
            </IntroduceList>
          </QueueAnim>
        </IntroduceDiv>
      </OverPack>
      {/* about */}
      {/* <AboutDiv id="about">
          <AboutDivContent>
            <AboutTitle>{t('home.about.title')}</AboutTitle>
                <ul>
                    <li>{t('home.about.list.1')}</li>
                    <li>{t('home.about.list.2')}</li>
                    <li>{t('home.about.list.3')}</li>
                </ul>
          </AboutDivContent>
        </AboutDiv> */}
      <OverPack playScale={[0.3, 0.7]}>
        <AboutDiv id="about">
          <AboutDivContent>
            <AboutTitle>{t('home.about.title')}</AboutTitle>
            <OverPack playScale={[0.01, 0.99]}>
              <QueueAnim type="left" key="ul">
                <ul>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 100 }}>
                    <li>{t('home.about.list.1')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 150 }}>
                    <li>{t('home.about.list.2')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 200 }}>
                    <li>{t('home.about.list.3')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 250 }}>
                    <li>{t('home.about.list.4')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 300 }}>
                    <li>{t('home.about.list.5')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 350 }}>
                    <li>{t('home.about.list.6')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 400 }}>
                    <li>{t('home.about.list.7')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 450 }}>
                    <li>{t('home.about.list.8')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 500 }}>
                    <li>{t('home.about.list.9')}</li>
                  </TweenOne>
                  <TweenOne animation={{ y: 30, opacity: 0, type: 'from', ease: 'easeOutQuad', delay: 550 }}>
                    <li>{t('home.about.list.10')}</li>
                  </TweenOne>
                </ul>
              </QueueAnim>
            </OverPack>
          </AboutDivContent>
        </AboutDiv>
      </OverPack>
    </HomeWrapper>
  )
})
