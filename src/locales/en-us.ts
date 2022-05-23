import footer from './en-us/footer'
import home from './en-us/home'
import governance from './en-us/governance'
import vault from './en-us/vault'
import info from './en-us/info'
import mynft from './en-us/mynft'
import market from './en-us/market'
import igonft from './en-us/igonft'
import myproject from './en-us/myproject'
import components from './en-us/components'

const en = {
  'app.link.btn': 'Wallet Connect',
  'app.link.suceess': 'Login Success',
  'app.link.disconnect': 'Logout Success',
  'app.link.modal.title': 'Choose a connection method',
  'app.link.modal.ftitle1': 'Choose Network',
  'app.link.title': 'Wallet Connect',
  'app.link.modal.ftitle2': 'Choose Wallet',
  'app.link.test.tips':
    'If you switch the network to [Test], please manually switch to http://47.108.77.85:8545 in Metamask or Wallet APP, and click login to take effect',
  'app.footer.copyright': '© 2022 Collex',
  'app.switch.language.tips': 'Switch {{msg}} Success',
  'app.no.chainid.tips': 'Please switch your wallet to a supported network',
  'app.no.chainid.btn': 'Change Network',
  'app.no.data.title': 'No related content is currently available,please stay tuned',
  'app.chainid.drawer.title': 'Select network',
  'app.404.title': 'The requested URL was not found',
  'app.404.btn': 'Back to Home',
  'app.my.title1': 'My Home',
  'app.my.title2': 'My NFT',
  'app.my.title3': 'Exit Link',
  'app.my.title4': 'My Project',
  ...footer,
  ...home,
  ...vault,
  ...governance,
  ...info,
  ...mynft,
  ...market,
  ...igonft,
  ...myproject,
  ...components,
}

export default en
