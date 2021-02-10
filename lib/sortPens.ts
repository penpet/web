import Pen from 'models/Pen'

const sortPens = (pens: Pen[]) =>
	pens.sort((a, b) => b.updated.getTime() - a.updated.getTime())

export default sortPens
