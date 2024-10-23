export const navRoutes = {
  'classes': { path: '/', icon: 'table-columns', label: 'Classes' },
  'team-list': { path: 'team-list', icon: 'user-group', label: 'Team' },
}

export const routes = {
  ...navRoutes,
  settings: { path: 'team-list', icon: 'gear', label: 'Settings' },
}

export const getTitle = pathname => {
  const key = pathname.replace('/', '')
  return key === '' ? routes.classes.label : routes[key].label
}
