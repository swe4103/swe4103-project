export const routes = {
  home: { path: '/home', icon: 'table-columns', label: 'Home' },
  settings: { path: '/settings', icon: 'gear', label: 'Settings' },
}

export const getTitle = pathname => {
  const key = pathname.replace('/', '')
  return key === '' ? routes.dashboard.label : routes[key].label
}
