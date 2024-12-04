import React, {useCallback, useContext} from 'react';
import {useAppSelector} from '../store/hook';
import {selectAuthState} from '../store/authSlice';

interface PermissionAndRoleContextTypes {
  hasAnyRole?: (name: string | string[]) => boolean;
  hasAnyPermission?: (name: string | string[]) => boolean;
}

export const RoleAndPermissionContext =
  React.createContext<PermissionAndRoleContextTypes>({});

const RolePermissionProvider = ({children}: {children: React.ReactNode}) => {
  const authState = useAppSelector(selectAuthState);

  const hasAnyPermission = useCallback(
    (permissions: string | string[]) => {
      const allPermissions = authState.user ? authState.user.permissions : [];
      let hasPermission = false;
      if (typeof permissions === 'string') {
        if (allPermissions.indexOf(permissions) !== -1) {
          hasPermission = true;
        }
      } else {
        permissions.forEach(function (item) {
          if (allPermissions.indexOf(item) !== -1) {
            hasPermission = true;
          }
        });
      }
      console.log('hasPermission ', hasPermission);
      console.log(permissions);
      return hasPermission;
    },
    [authState.user],
  );

  const hasAnyRole = useCallback(
    (roles: string | string[]) => {
      console.log(authState.user?.roles);
      const allRoles = authState.user
        ? authState.user.roles.map(item => item.name)
        : [];
      let hasRole = false;
      if (typeof roles === 'string') {
        if (allRoles.indexOf(roles) !== -1) {
          hasRole = true;
        }
      } else {
        roles.forEach(function (item) {
          if (allRoles.indexOf(item) !== -1) {
            hasRole = true;
          }
        });
      }
      console.log('hasRole ', hasRole);
      console.log(roles);
      return hasRole;
    },
    [authState.user],
  );

  return (
    <RoleAndPermissionContext.Provider value={{hasAnyRole, hasAnyPermission}}>
      {children}
    </RoleAndPermissionContext.Provider>
  );
};

export const useRoleAndPermission = () => useContext(RoleAndPermissionContext);

export default RolePermissionProvider;
