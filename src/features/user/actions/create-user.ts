"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userRoleMembers } from "@/db/drizzle/schema";
import { createServerAdminClient } from "@/db/supabase/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // VALIDATION
  const validationResult = await zfd
    .formData({
      name: zfd.text(z.string().min(1).max(100)),
      username: zfd.text(z.string().min(3).max(20)),
      userRoles: zfd.repeatable(
        z.array(zfd.numeric(z.number().int().positive())).min(1),
      ),
      password: zfd.text(z.string().min(6).max(30)),
      passwordConfirmation: zfd.text(z.string().min(6).max(30)),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
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
      // insert user
      const {
        data: { user: createdUser },
        error: createUserError,
      } = await supabaseAdmin.auth.admin.createUser({
        email_confirm: true,
        email: validationResult.data.username + "@email.com",
        password: validationResult.data.password,
        user_metadata: {
          name: validationResult.data.name,
        },
      });

      if (createUserError || !createdUser) {
        throw new Error(
          createUserError?.message ?? "Terjadi kesalahan saat membuat user",
        );
      }

      // update user roles
      const userRolesPromises = [];

      const hasUserRole = validationResult.data.userRoles.includes(1);
      const userRolesWithoutUserRole = validationResult.data.userRoles.filter(
        (roleId) => roleId !== 1,
      );

      if (userRolesWithoutUserRole.length > 0) {
        userRolesPromises.push(
          tx.insert(userRoleMembers).values(
            userRolesWithoutUserRole.map((roleId) => ({
              userId: createdUser.id,
              userRoleId: roleId,
            })),
          ),
        );
      }

      // kalau tidak ada role user / role === 1, hapus role user karena ini auto generate
      if (!hasUserRole) {
        userRolesPromises.push(
          tx.delete(userRoleMembers).where(eq(userRoleMembers.userRoleId, 1)),
        );
      }

      // update user roles
      await Promise.all(userRolesPromises);
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Terjadi kesalahan",
      },
    };
  }

  return {
    message: "User berhasil dibuat",
  };
}
