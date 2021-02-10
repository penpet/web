import { PenData } from 'models/Pen'
import fetch from 'lib/fetch'

const createPen = () => fetch<PenData>('pens', { method: 'POST' })

export default createPen
