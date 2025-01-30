"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userProfiles, userRoleMembers } from "@/db/drizzle/schema";
import { createServerAdminClient } from "@/db/supabase/server";
import { eq, inArray, InferInsertModel } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function updateUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().uuid()),
    name: zfd.text(z.string().min(1)),
    username: zfd.text(z.string().min(5)),
    userRoles: zfd.repeatable(
      z.array(zfd.numeric(z.number().int().positive())).min(1),
    ),
    password: zfd.text(z.string().min(6).optional()),
    passwordConfirmation: zfd.text(z.string().min(6).optional()),
  });

  const validationResult = await zfd
    .formData(validationRules)
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted =
      validationResult.error.format() as z.inferFormattedError<
        typeof validationRules
      >;

    return {
      error: {
        general: errorFormatted.id?._errors,
        name: errorFormatted.name?._errors,
        username: errorFormatted.username?._errors,
        password: errorFormatted.password?._errors,
        passwordConfirmation: errorFormatted.passwordConfirmation?._errors,
        userRoles: errorFormatted.userRoles?._errors,
      },
    };
  }

  const supabaseAdmin = await createServerAdminClient();

  try {
    await db.transaction(async (tx) => {
      // update user
      const userProfileData: Omit<
        InferInsertModel<typeof userProfiles>,
        "id"
      > = {
        name: validationResult.data.name,
        updatedAt: new Date(),
      };

      // update user roles
      const currentUserRoles = await tx
        .select({
          id: userRoleMembers.id,
          userId: userRoleMembers.userId,
          userRoleId: userRoleMembers.userRoleId,
        })
        .from(userRoleMembers)
        .where(eq(userRoleMembers.userId, validationResult.data.id));

      const newUserRoles: {
        userId: string;
        userRoleId: number;
      }[] = [];
      const deletedUserRoles: {
        id: number;
      }[] = [];

      // insert user role if not exist in current user roles
      validationResult.data.userRoles.forEach((roleId) => {
        const hasRole = currentUserRoles.find(
          (role) => role.userRoleId === roleId,
        );

        if (!hasRole) {
          newUserRoles.push({
            userId: validationResult.data.id,
            userRoleId: roleId,
          });
        }
      });

      // delete user role if not exist in new user roles, and keep the rest
      currentUserRoles.forEach((role) => {
        const hasRole = validationResult.data.userRoles.includes(
          role.userRoleId,
        );

        if (!hasRole) {
          deletedUserRoles.push({
            id: role.id,
          });
        }
      });

      // update user profile and insert user roles
      const updateUserPromiseArray: unknown[] = [
        tx
          .update(userProfiles)
          .set(userProfileData)
          .where(eq(userProfiles.id, validationResult.data.id)),
      ];

      if (deletedUserRoles.length > 0) {
        updateUserPromiseArray.push(
          tx.delete(userRoleMembers).where(
            inArray(
              userRoleMembers.id,
              deletedUserRoles.map((role) => role.id),
            ),
          ),
        );
      }

      if (newUserRoles.length > 0) {
        updateUserPromiseArray.push(
          tx.insert(userRoleMembers).values(newUserRoles),
        );
      }

      await Promise.all(updateUserPromiseArray);

      // update user data
      const { error: updateUserError } =
        await supabaseAdmin.auth.admin.updateUserById(
          validationResult.data.id,
          {
            email: validationResult.data.username + "@email.com",
            password: validationResult.data.password,
          },
        );

      if (updateUserError) {
        throw new Error(updateUserError.message);
      }
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Terjadi kesalahan",
      },
    };
  }

  return {
    message: "User berhasil diupdate",
  };
}
