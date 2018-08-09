import 'react-emotion'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

console.log('setup framework')

configure({ adapter: new Adapter() })
