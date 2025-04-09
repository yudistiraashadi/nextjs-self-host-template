# Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

# Project Structure

Project structure secara garis besar untuk template Next.js kita adalah sebagai berikut:

```Markdown
├── src                        # Most of project codes would be here
│   ├── app                    # App router (https://nextjs.org/docs/app)
│   ├── components             # Global UI components
│   ├── db                     # Anything related to DB
│   │   ├── drizzle
│   │   │   ├── connection.ts
│   │   │   └── schema.ts
│   │   └── supabase
│   │       ├── browser.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   ├── features                # Feature codes (user, etc.)
│   ├── lib                     # Helper and utils
│   └── middleware.ts
├── supabase                    # Supabase config, migrations, and seed
│   ├── migrations
│   └── seed.sql
├── eslint.config.mjs           # Everything below are mostly configs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

Berikut penjelasan dari masing-masing directories dan files:

## `src/`

`src/` adalah tempat untuk untuk keseluruhan dari project source code related dengan Next.js. Code diluar `src/` biasanya code untuk config atau code untuk project lain seperti `backend` menggunakan Python atau config file lainnya.
Didalam `src/` folder terdapat folder-folder lagi sebagai berikut:

### `app`

Ini adalah App Router milik Next.js. Untuk detailnya dapat dilihat di docs mereka di https://nextjs.org/docs/app . Yang perlu diperhatikan adalah root layout kita di bawah folder app langsung yang sudah disetting untuk mengakomodi package-package lain seperti Tanstack Query dan Mantine.

### `components`

Karena kita menggunakan Mantine, majoritas UI sudah disediakan oleh mereka. Tapi seringkali, setiap project memerlukan sebuah custom UI sendiri. Ini adalah tempat custom UI component yang dipakai secara global diletakkan. Secara thumb rule, usahakan letakan custom component UI sebisa munggkin di dalam folder `features` karena kebanyakan custom UI ter-coupling dengen sebuah fitur. Tetapi apabila custom UI tidak ter-coupling dan dipakai diberbagai tempat, maka aman untuk diletakkan didalam folder ini.

### `db`

Folder ini adalah tempat untuk semua sesuatu tentang DB connection. Folder `db` seringkali hanya diisi dengan 2 folder lain: `drizzle` dan `supabase`, tetapi apabila menggunakan abstraksi lain seperti indexedDB, bisa ditambakan folder baru didalam folder ini.

#### `drizzle`

[Drizzle ORM](https://orm.drizzle.team/docs/overview) adalah package Object-Relational Mapping (ORM) yang berfungsi sebagai layer yang memberikan type-safety untuk membangun query SQL. Drizzle ORM mempunyai keunggulan types yang cocok digunakan dengan bahasa Typescript dan syntax yang sangat mirip dengan SQL biasa sehingga sangat mudah digunakan.

Folder drizzle berisi 2 files: `connections.ts` dan `schema.ts`. Untuk detail mengenai Drizzle ORM dapat dlihat di https://orm.drizzle.team/docs/overview
connection.ts berfungsi sebagai facade untuk koneksi dengan database. Tidak perlu otak-atik file ini kecuali mau menggunakan >1 schema file atau mengganti database menjadi MySQL atau SQLite.

`schema.ts` adalah file utama tempat schema dari Drizzle ORM. Untuk detail mengenai schema, dapat dilihta di documentasi Drizzle ORM di https://orm.drizzle.team/docs/sql-schema-declaration

#### `supabase`

[Supabase](https://supabase.com/docs/reference/javascript/introduction) adalah Backend-as-a-Service (BaaS) yang merupakan wrapper on top of Postgres yang memberikan berbagai fitur berguna seperti Authentication, Image Bucket, API layer, Database Vector, Dashboard, dll. Supabase sering sekali kita gunakan karena memiliki fitur yang lengkap diatas Postgres extension dan kemudahan untuk dapat di self host.

Folder supabase berisikan 3 files: `browser.ts`, `middleware.ts`, `server.ts`.

`browser.ts` dan `server.ts` berisikan facade untuk membuat koneksi Supabase di 2 tempat berbeda, di browser (e.g. file yang mempunya directives `"use client"`) dan di server (e.g. Dalam RSC atau directives `"use server"`), sesuai dengan nama mereka.

`middleware.ts` adalah file untuk pengecekan authorization melalui fitur auth dari Supabase. Didalam file ini terdapat function yang akan di-exsport ke dalam Next.js' middleware.

### `features`

Features merupakan teknik colocation source code berdasarkan fungsi dari kode tersebut. Alasan mengapa teknik ini sering disukai karena, kebanyakan waktu yang digunakan oleh software engineer adalah untuk membaca dan refaktor code. Maka colocation source code berdasarkan fitur dapat membantu mempercepat refaktoring tanpa harus pindah folder. Contoh dari implementasi ini dapat dilihat di https://x.com/TkDodo/status/1749717832642736184 .

Penggunaan folder `features` di template kita, biasanya dibagi menjadi beberapa file dan folder sebagai berikut:

- `actions`: server actions (https://react.dev/reference/rsc/server-functions) untuk CRUD
- `components`: component-component terkait fitur. Seringkali berisi:
  - `form`
  - `table`
  - `view`
  - dll.
- `utils`: utility function khusus fitur ini.

### `lib`

Berisikan helper-helper functions seperti custom `hooks`, helper untuk supabase, compress image, dll.

# Naming Convention

## 1. Files and Directories

- Use `kebab-case` for directories and files: `create-or-update-user-modal-form.tsx`
- TypeScript config files use `.ts` extension: next.config.ts, tailwind.config.ts
- Configuration files use appropriate extensions: `.mjs`, `.ts`, `.json`

## 2. React Components

- Use `PascalCase` for component names: `export function CreateOrUpdateUserModalForm()`
- Group related components in feature folders under features

## 3. Functions

- Use `camelCase` for function names like: `deletePlatNomorAction`
- Server actions (under `actions/`) use descriptive verbs: `createUser`, `updateUser`, `deleteUser`
- Query related functions use consistent suffixes: `getAllUserQueryOptions`

## 4. Variables

- Use `camelCase` for variables and state: `userData`, `platNomorException`
- Boolean variables often start with `is`: `isOpen`, `isActionPending`

## 5. Database

- Use `snake_case` for database table and column names in Drizzle schema
- Use descriptive singular nouns for table names

## 6. Project Structure

- Core code lives in src directory
- Features are grouped in features
- Shared components in components
- Database code in db
- Utilities in lib

# Common Patterns

## 1. Read operation w/ Server Action and Tanstack Query

Server action merupakan sebuah function khusus yang diperkenalkan di React 19 https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations . Server action merupakan semacam RPC dimana function dapat digunakan secara langsung di client maupun di server component. Secara teknis, server action sekarang hanya menggunakan POST request, tapi bisa digunakan layaknya GET request, yaitu untuk melakukan Read operation.

[Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview) adalah sebuah package untuk membantu GET (`useQuery`) dan POST (`useMutation`) request. Di Next.js, sebenarnya tidak diperlukan penggunaan Tanstack Query, karena GET request bisa menggunakan RSC dan POST request bisa menggunakan Server Action. Tetapi, kelemahan dari RSC adalah, apabila satu component memerlukan >1 data berbeda, maka setiap request pada RSC akan tetap mengambil data dari semua sumber data instead of spesifik data yang diperlukan. Berikut contohnya:

```tsx
//
// NOT OPTIMIZED!!!
//
export default function Page() {
  // fetch data dari 3 data berbeda melalui RSC
  const [data1, data2, data3] = await Promise.all([
    fetch("../1"),
    fetch("../2"),
    fetch("../3"),
  ]);

  return <Component data1={data1} data2={data2} data3={data3} />;
}

function Component({ data1, data2, data3 }: any) {
  return (
    <section>
      <div>
        {data1}
        {/* 
            setiap kali melakukan reset data, kita perlu untuk
            fetch ulang the RSC component, thus akan terus
            fetch 3 data walaupun hanya ingin fetch 1 data
        */}
        <button onclick={resetData1} />
      </div>

      <div>
        {data2}
        <button onclick={resetData2} />
      </div>

      <div>
        {data3}
        <button onclick={resetData3} />
      </div>
    </section>
  );
}
```

Hal ini merupakan masalah yang disebut <strong>fine-grained data fetching</strong>. Untuk mengatasi masalah tersebut, kita dapat menggunakan Tanstack Query sebagai berikut:

```tsx
//
// OPTIMIZED WITH TANSTACK QUERY!
//
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default function Page() {
  const queryClient = getQueryClient();

  // prefetch data dari 3 data berbeda melalui RSC
  const [data1, data2, data3] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["data", 1],
      queryFn: fetch("../1"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["data", 2],
      queryFn: fetch("../2"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["data", 3],
      queryFn: fetch("../3"),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Component />
    </HydrationBoundary>
  );
}
```

```tsx
"use client";

function Component() {
  const queryClient = useQueryClient();

  // hasil prefetch akan masuk on mount ke data1, data2, dan data3, sehingga
  // akan immediately available
  const data1 = useQuery({
    queryKey: ["data", 1],
    queryFn: fetch("../1"),
  });

  const data2 = useQuery({
    queryKey: ["data", 2],
    queryFn: fetch("../2"),
  });

  const data3 = useQuery({
    queryKey: ["data", 3],
    queryFn: fetch("../3"),
  });

  return (
    <section>
      <div>
        {data1.data}
        {/* 
            reset data 1 akan berupa tanstackQuery's invalidateQuery
            untuk melakukan data invalidation secara fine-grained
        */}
        <button
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["data", 1],
            });
          }}
        >
          Invalide Data 1
        </button>
      </div>

      <div>
        {data2.data}
        <button
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["data", 2],
            });
          }}
        >
          Invalide Data 2
        </button>
      </div>

      <div>
        {data3.data}
        <button
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["data", 3],
            });
          }}
        >
          Invalide Data 3
        </button>
      </div>
    </section>
  );
}
```

## 2. Server Actions for CRUD with zod and zod-form-data

Server actions digunakan untuk melakukan CRUD operation pada server. Untuk melakukan validasi data, kita menggunakan `zod` untuk melakukan validasi data. `zod` adalah package yang digunakan untuk melakukan validasi data dengan menggunakan schema. `zod-form-data` adalah package yang digunakan untuk melakukan validasi data dari form-data.

Berikut contoh penggunaan `zod` dan `zod-form-data`:

```tsx
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // VALIDATION
  const validationRules = z.object({
    name: zfd.text(z.string().min(1).max(100)),
    username: zfd.text(z.string().min(3).max(20)),
    userRoles: zfd.repeatable(
      z.array(zfd.numeric(z.number().int().positive())).min(1),
    ),
    password: zfd.text(z.string().min(6).max(30)),
    passwordConfirmation: zfd.text(z.string().min(6).max(30)),
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
    const errorFlattened =
      validationResult.error.format() as z.inferFormattedError<
        typeof validationRules
      >;

    return {
      error: {
        general: undefined,
        name: errorFlattened.name?._errors,
        username: errorFlattened.username?._errors,
        password: errorFlattened.password?._errors,
        passwordConfirmation: errorFlattened.passwordConfirmation?._errors,
        userRoles: errorFlattened.userRoles?._errors,
      },
    };
  }

  // Rest of the code
}
```

## 3. Table w/ Tanstack Query and Modals

Penggunaan Tanstack Query dengan modals juga sangat bagus dengan meleverage teknik Read operation w/ Server Action and Tanstack Query. Penggunaan modal dianjutkan untuk form-form yang tidak memerlukan input yang banyak seperti edit pada data simpel dan deletion. Alurnya adalah:

1. Lakukan prefetch query di App Router's RSC dan ambil data dengan useQuery, seperti di Read operation w/ Server Action and Tanstack Query.
2. Didalam table, berikan satu kolom e.g. "Action", dimana diletakkan tombol untuk melakukan aksi seperti edit atau delete.
3. Setiap aksi akan membuka modal. Setelah form atau aksi berhasil dilakukan, update data di useQuery dengan menggunakan queryClient.invalidateQueries() dengan queryKey yang sama. queryKey akan menjadi semacam ID untuk queryClient menghapus / mengupdate data.

Berikut contohnya:

```tsx
"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { deletePlatNomorException } from "@/features/plat-nomor-exception/actions/delete-plat-nomor-exception";
import { GetAllPlatNomorExceptionResponse } from "@/features/plat-nomor-exception/actions/get-all-plat-nomor-exception";
import { getAllPlatNomorExceptionQueryOptions } from "@/features/plat-nomor-exception/actions/get-all-plat-nomor-exception/query-options";
import { CreateOrUpdatePlatNomorExceptionModalForm } from "@/features/plat-nomor-exception/components/form/create-or-update-plat-nomor-exception-modal-form";
import { useEffectEvent } from "@/lib/hooks/use-effect-event";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export function PlatNomorExceptionTable() {
  // MODAL STATE
  const [selectedPlatNomorException, setSelectedPlatNomorException] = useState<
    | {
        id: string;
        platNomor: string;
      }
    | undefined
  >();

  const [isOpen, { open, close }] = useDisclosure(false, {
    onClose: () => setSelectedPlatNomorException(undefined),
  });
  // END OF MODAL STATE

  // QUERY DATA
  const queryClient = useQueryClient();

  const platNomorExceptionQuery = useQuery(
    getAllPlatNomorExceptionQueryOptions(),
  );
  // END OF QUERY DATA

  // DELETE PLAT NOMOR EXCEPTION
  const [deletePlatNomorState, deletePlatNomorAction] = useActionState(
    deletePlatNomorException,
    undefined,
  );

  const renderDeletePlatNomorModal = useCallback(
    (platNomorExceptionId: string) => {
      modals.open({
        modalId: "delete-plat-nomor",
        title: "Hapus Plat Nomor",
        centered: true,
        children: (
          <>
            <div className="text-sm">
              Apakah kamu yakin untuk menghapus Plat Nomor ini?
            </div>

            <form
              action={(formData) => {
                formData.set("id", platNomorExceptionId);

                deletePlatNomorAction(formData);
              }}
              className="mt-6"
            >
              <div className="flex gap-2">
                <Button
                  variant="default"
                  color="gray"
                  onClick={() => modals.close("delete-plat-nomor")}
                >
                  Batal
                </Button>
                <SubmitButton color={"red"}>Hapus</SubmitButton>
              </div>
            </form>
          </>
        ),
      });
    },
    [deletePlatNomorAction],
  );

  const deletePlatNomorEffectEvent = useEffectEvent(
    (state: typeof deletePlatNomorState) => {
      if (state) {
        formStateNotificationHelper({
          state,
          successCallback: () => {
            modals.close("delete-plat-nomor");
            // setelah deletion, data di invalidasi dengan queryClient.invalidateQueries
            // untuk refresh ulang data
            queryClient.invalidateQueries(
              getAllPlatNomorExceptionQueryOptions(),
            );
          },
        });
      }
    },
  );

  useEffect(
    () => deletePlatNomorEffectEvent(deletePlatNomorState),
    [deletePlatNomorState, deletePlatNomorEffectEvent],
  );
  // END OF DEACTIVATE USER

  const columns = useMemo<
    MRT_ColumnDef<GetAllPlatNomorExceptionResponse[number]>[]
  >(
    () => [
      {
        accessorKey: "platNomor",
        header: "Plat Nomor",
        filterFn: "contains",
      },
      {
        accessorFn: (row) =>
          row.createdAt
            ? dayjs(row.createdAt).format("DD/MM/YYYY, HH:mm:ss")
            : "-",
        id: "dibuat",
        header: "Waktu Dibuat",
        filterVariant: "date-range",
      },
      {
        header: "Action",
        size: 100,
        Cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <Button
              color="green"
              onClick={() => {
                setSelectedPlatNomorException({
                  id: row.original.id,
                  platNomor: row.original.platNomor,
                });
                open();
              }}
            >
              Edit
            </Button>
            <Button
              color="red"
              onClick={() => renderDeletePlatNomorModal(row.original.id)}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [open, setSelectedPlatNomorException, renderDeletePlatNomorModal],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: platNomorExceptionQuery,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: platNomorExceptionQuery.data ?? [],
  });

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <Button color="blue" onClick={open} leftSection={<IconPlus />}>
          Tambah Plat Nomor
        </Button>
      </div>

      <MantineReactTable table={table} />

      {isOpen ? (
        <CreateOrUpdatePlatNomorExceptionModalForm
          isOpen={isOpen}
          onClose={close}
          platNomorExceptionData={selectedPlatNomorException}
        />
      ) : null}
    </section>
  );
}
```

## 4. Single Form for update / create

Untuk sebuah form, biasanya satu form digunakan untuk satu operation. Tetapi karena biasanya update / create menyangkut di satu data yang sama, maka sebenarnya bisa digunakan satu form yang sama dengan merubah beberapa bagian. Alurnya adalah:

1. Saat membuka sebuah form, ada 2 kemungkinan: form untuk create atau form untuk edit. Untuk tau mau form untuk edit / create, bisa dilakukan pengecekan pada data yang diberikan. Apa bila ada data existing biasanya pada props data, maka bisa disetup untuk melakukan edit, jika tidak maka dilakukan setup untuk create form.
2. Untuk edit / create, juga dilakukan penggunaan server actions yang berbeda untuk dimasukkan ke hook `useActionState`. Tetapi ada 1 kelemahan: component harus remounting untuk ganti dari edit ke create dan sebaliknya, atau server action tidak akan terganti. Oleh sebab itu, saat import component form, ada baiknya untuk component di destroy saat form tidak digunakan atau diletakkan di halaman lain.
3. Lakukan modifikasi pemanggilan `action` pada `useActionState` e.g. Pemasukkan id dari data apabila melakukan edit, dsb.

```tsx
"use client";

import { createUser } from "@/features/user/actions/create-user";
import { getAllUserRoleQueryOptions } from "@/features/user/actions/get-all-user-role/query-options";
import { getAllUserQueryOptions } from "@/features/user/actions/get-all-user/query-options";
import type { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { getUserByIdQueryOptions } from "@/features/user/actions/get-user-by-id/query-options";
import { updateUser } from "@/features/user/actions/update-user";
import { useEffectEvent } from "@/lib/hooks/use-effect-event";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Button,
  Divider,
  Modal,
  MultiSelect,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

type CreateOrUpdateUserModalFormProps = {
  userData?: GetUserByIdResponse | null;
  isOpen: boolean;
  onClose: () => void;
  successCallback?: () => void;
};

export function CreateOrUpdateUserModalForm({
  userData,
  isOpen,
  onClose,
  successCallback,
}: CreateOrUpdateUserModalFormProps) {
  // QUERY DATA
  const queryClient = useQueryClient();

  const userRoleData = useQuery(getAllUserRoleQueryOptions());
  // END QUERY DATA

  // CREATE OR UPDATE USER
  const [actionState, actionDispatch, isActionPending] = useActionState(
    userData ? updateUser : createUser,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          onClose();

          // invalidate all user cache
          queryClient.invalidateQueries(getAllUserQueryOptions());

          // kalau update user, invalidate user yang bersangkutan
          if (userData) {
            queryClient.invalidateQueries(getUserByIdQueryOptions(userData.id));
          }

          if (successCallback) {
            successCallback();
          }
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );
  // END CREATE OR UPDATE USER

  return (
    <Modal
      opened={isOpen}
      centered
      onClose={onClose}
      title={userData ? "Update User" : "Tambah User"}
      size={"xl"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          startTransition(() => {
            const formData = new FormData(e.currentTarget);

            if (userData) {
              formData.append("id", userData.id);
            }

            // apparently MultiSelect give the value as "value1, value2, value3, ...", so
            // we need to make array of userRolesString to userRoles
            if (formData.get("userRolesString")) {
              const userRolesArray = (
                formData.get("userRolesString") as string
              ).split(",");

              userRolesArray.forEach((role) => {
                formData.append("userRoles", role);
              });
            }

            actionDispatch(formData);
          });
        }}
        className="grid gap-4"
      >
        {/* user roles */}
        <MultiSelect
          label="Role"
          required
          name="userRolesString"
          error={actionState?.error?.userRoles}
          defaultValue={
            userData?.userRole?.map((role) => role.id.toString()) ?? ["1"]
          }
          data={userRoleData.data?.map((role) => ({
            value: role.id.toString(),
            label: role.name,
          }))}
        />

        <Divider />

        {/* name */}
        <TextInput
          required
          label="Nama Lengkap"
          name="name"
          error={actionState?.error?.name}
          defaultValue={userData?.name ?? ""}
        />

        {/* username */}
        <TextInput
          required
          label="Username"
          name="username"
          error={actionState?.error?.username}
          defaultValue={userData?.username ?? ""}
        />

        <Divider />

        {/* password */}
        <PasswordInput
          label="Password"
          name="password"
          required={!userData}
          description={
            userData && "Kosongkan jika tidak ingin mengubah password"
          }
          error={actionState?.error?.password}
        />

        {/* password confirmation */}
        <PasswordInput
          label="Konfirmasi Password"
          name="passwordConfirmation"
          required={!userData}
          description={
            userData && "Kosongkan jika tidak ingin mengubah password"
          }
          error={actionState?.error?.passwordConfirmation}
        />

        <div className="mt-12 flex justify-end">
          <Button type="submit" loading={isActionPending}>
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

## 5. UUIDv7 for Multiple Data Insertion

`UUID` atau Universally Unique Identifier adalah 36-character alphanumeric string yang biasa digunakan sebagai ID di table database. UUID sangat berguna untuk melakukan insertion pada >1 table yang bergantung pada satu sama lain. Dengan begini, tidak perlu menunggu insertion main record sebelum insert second record dan keduanya bisa dilakukan insertion secara concurrently.

`UUIDv7` lebih diutamakan karena ia memiliki order secara time (time-ordered structure), tidak seperti `UUIDv4` yang random. Hal ini lebih diuntungkan khususnya saat melakukan read operation untuk memudahkan indexing B-tree pada database https://shambhavishandilya.medium.com/b-tree-indexing-basics-explained-%EF%B8%8F-56ae0bda46c4.

Alurnya adalah:

1. Create ID dengan UUIDv7 untuk main table record
2. Insert record pada main table dan table lainnya dengan ID main record sebagai foreign key di table kedua.

Sebagai contoh:

```tsx
import { v7 as uuidv7 } from "uuid";

// Insert data berupa mobil (car) dan owner mobil tersebut (owner)
const mainRecordId = uuidv7();

await Promise.all([
  db.insert(car).values({
    id: mainRecordId,
    name,
    brand,
  }),
  db.insert(owner).values({
    ownerUserId,
    carId: mainRecordId, // ini merupakan foreign key yang menghubungkan owner-car
  }),
]);
```

## 6. Image Insertion to Supabase

Supabase sebagai BaaS, digunakan juga sebagai sumber bucket untuk files seperti image dan videos. Khusus untuk image, disarankan untuk pertama melakukan compression pada image agar penampilan image tetap optimal. Beserta dengan `UUIDv7`, dapat dilakukan proses seperti berikut:

```tsx
import { v7 as uuidv7 } from "uuid";
import { compressImageWebp } from "@/lib/image/compress-image-webp";

const recordId = uuidv7();

// Compress both images concurrently
const [stnkBuffer, ktpBuffer] = await Promise.all([
  validationResult.data.stnk.arrayBuffer().then((buffer) =>
    compressImageWebp({
      buffer,
      width: 1200,
      quality: 92,
      maxSize: 500000, // 500kb
    }),
  ),
  validationResult.data.ktp.arrayBuffer().then((buffer) =>
    compressImageWebp({
      buffer,
      width: 1200,
      quality: 92,
      maxSize: 500000, // 500kb
    }),
  ),
]);

// Upload both compressed images concurrently
const [stnkUpload, ktpUpload] = await Promise.all([
  supabase.storage
    .from("ticket_hilang")
    .upload(recordId + "_stnk.webp", stnkBuffer, {
      contentType: "image/webp",
      upsert: true,
    }),
  supabase.storage
    .from("ticket_hilang")
    .upload(recordId + "_ktp.webp", ktpBuffer, {
      contentType: "image/webp",
      upsert: true,
    }),
]);

if (stnkUpload.error) throw new Error(stnkUpload.error.message);
if (ktpUpload.error) throw new Error(ktpUpload.error.message);

// insert data
await db.insert(ticketHilang).values({
  id: recordId,
  platNomor: validationResult.data.platNomor,
  stnk: stnkUpload.data.fullPath,
  ktp: ktpUpload.data.fullPath,
});
```
