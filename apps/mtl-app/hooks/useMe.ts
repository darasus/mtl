import { UserProfile, useUser } from "@auth0/nextjs-auth0";
import React from "react";

export enum Role {
  ADMIN,
  USER,
}

interface UseMe {
  error?: Error;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  user:
    | (UserProfile & {
        id?: string;
        role: Role;
      })
    | null;
}

export const useMe = () => {
  const session = useUser();

  const user = React.useMemo(
    () =>
      session?.user
        ? {
            ...(session?.user || {}),
            id: session?.user?.sub?.split("|")[1],
            role:
              session?.user?.email === "idarase@gmail.com"
                ? Role.ADMIN
                : Role.USER,
          }
        : null,
    [session]
  );

  const me: UseMe = React.useMemo(
    () => ({
      ...session,
      user,
    }),
    [session, user]
  );

  if (!user) return null;

  return me;
};
