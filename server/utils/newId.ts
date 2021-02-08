import { nanoid } from 'nanoid'

import { ID_LENGTH } from '../constants'

const newId = () => nanoid(ID_LENGTH)

export default newId
