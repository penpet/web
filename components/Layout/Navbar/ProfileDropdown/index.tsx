import { useState } from 'react'

import Pal from 'models/Pal'
import Dropdown from 'components/Dropdown'
import Trigger, { triggerClassName } from './Trigger'
import Content, { contentClassName } from './Content'

export interface ProfileDropdownProps {
	className?: string
	pal: Pal
}

const ProfileDropdown = ({ className, pal }: ProfileDropdownProps) => {
	const [isShowing, setIsShowing] = useState(false)

	return (
		<Dropdown
			className={className}
			triggerClassName={triggerClassName}
			contentClassName={contentClassName}
			trigger={<Trigger pal={pal} />}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<Content pal={pal} isShowing={isShowing} />
		</Dropdown>
	)
}

export default ProfileDropdown
