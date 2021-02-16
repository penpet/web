enum Role {
	Owner = 'owner',
	Editor = 'editor',
	Viewer = 'viewer'
}

export default Role

export enum PublicRole {
	Editor = 'editor',
	Viewer = 'viewer'
}

export const serializeRole = (role: Role) => {
	switch (role) {
		case Role.Owner:
			return 0
		case Role.Editor:
			return 1
		case Role.Viewer:
			return 2
	}
}
