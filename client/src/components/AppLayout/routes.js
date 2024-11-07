export const navRoutes = {
  'classes': { path: '/', icon: 'table-columns', label: 'Classes' },
  'team-list': { path: 'team-list', icon: 'user-group', label: 'Team' },
}

export const routes = {
  ...navRoutes,
  settings: { path: 'team-list', icon: 'gear', label: 'Settings' },
}

export const getTitle = pathname => {
  const normalizedPath = pathname.replace(/^\/|\/$/g, '') // Remove leading and trailing slashes
  const route = routes[normalizedPath] || routes['classes'] // Default to 'classes' if not found
  return route.label
}
