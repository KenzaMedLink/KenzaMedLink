export const ROLE_HIERARCHY = {
  owner: 5,
  developer: 4,
  admin: 3,
  acct: 2,
  staff: 1,
  doctor: 0,
  lab: 0,
  pharmacy: 0,
  nhis: 0,
  patient: 0,
};

export const hasAccess = (userRole, requiredRole) => {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};