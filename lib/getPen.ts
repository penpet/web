import { PenData } from 'models/Pen'
import fetch from './fetch'

const getPen = (id: string) => fetch<PenData>(`pens/${id}`)

export default getPen
