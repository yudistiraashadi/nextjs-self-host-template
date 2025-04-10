"use client";

import { createPost } from "@/features/EXAMPLE-post/actions/create-post";
import { getPostByIdQueryOptions } from "@/features/EXAMPLE-post/actions/get-post-by-id";
import type { GetPostListResponse } from "@/features/EXAMPLE-post/actions/get-post-list";
import { updatePost } from "@/features/EXAMPLE-post/actions/update-post";
import { useEffectEvent } from "@/lib/hooks/use-effect-event";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export function CreateOrUpdatePostModalForm({
  postData,
  isOpen,
  onClose,
  successCallback,
}: {
  postData?: GetPostListResponse[number];
  isOpen: boolean;
  onClose: () => void;
  successCallback?: () => void;
}) {
  const queryClient = useQueryClient();

  // CREATE OR UPDATE POST
  const [actionState, actionDispatch, isActionPending] = useActionState(
    postData ? updatePost : createPost,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          onClose();

          // invalidate all post cache
          queryClient.invalidateQueries({
            queryKey: ["post", "list"],
          });

          // if updating post, invalidate the specific post
          if (postData) {
            queryClient.invalidateQueries(
              getPostByIdQueryOptions({ id: postData.id }),
            );
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
  // END CREATE OR UPDATE POST

  return (
    <Modal
      opened={isOpen}
      centered
      onClose={onClose}
      title={postData ? "Update Post" : "Add New Post"}
      size={"xl"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          startTransition(() => {
            const formData = new FormData(e.currentTarget);

            if (postData) {
              formData.append("id", postData.id);
            }

            actionDispatch(formData);
          });
        }}
        className="grid gap-4"
      >
        {/* title */}
        <TextInput
          required
          label="Title"
          name="title"
          error={actionState?.error?.title}
          defaultValue={postData?.title ?? ""}
        />

        {/* content */}
        <Textarea
          required
          label="Content"
          name="content"
          error={actionState?.error?.content}
          defaultValue={postData?.content ?? ""}
          minRows={5}
        />

        <Divider />

        {/* isProtected */}
        <Checkbox
          label="Protected Post"
          name="isProtected"
          value="1"
          defaultChecked={postData?.isProtected ?? false}
        />

        <div className="mt-12 flex justify-end">
          <Button type="submit" loading={isActionPending}>
            {postData ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
