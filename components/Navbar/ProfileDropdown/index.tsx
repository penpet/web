import { useState } from 'react'

import Pal from 'models/Pal'
import Dropdown from 'components/Dropdown'
import Trigger, { triggerClassName } from './Trigger'
import Content, { contentClassName } from './Content'

export interface ProfileDropdownProps {
	pal: Pal
}

const ProfileDropdown = ({ pal }: ProfileDropdownProps) => {
	const [isShowing, setIsShowing] = useState(false)

	return (
		<Dropdown
			triggerClassName={triggerClassName}
			contentClassName={contentClassName}
			trigger={<Trigger pal={pal} />}
			isShowing={isShowing}
			setIsShowing={setIsShowing}
		>
			<Content />
		</Dropdown>
	)
}

export default ProfileDropdown
