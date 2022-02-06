import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

// At it's simplest, access control is either yes or no, is the user signed in or not
export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

// Permission check if someone meets a criteria - yes or no.
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

// Rule based functions
// Rules can returan a boolean - yes or no - or a filter which limits which products they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of can ManageProducts?
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of can ManageProducts?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // If not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of can ManageProducts?
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // If not, do they own this item?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // Do they have the permission of can ManageProducts?
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // otherwise, only update themselves
    return { id: session.itemId };
  },
};
