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
  FileInput,
  Modal,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect, useState } from "react";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

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

  // Preview uploaded image
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

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

            // print form data
            for (const [key, value] of formData.entries()) {
              console.log(key, value);
            }

            if (postData) {
              formData.append("id", postData.id);
            }

            // Add the image file to formData if it exists
            if (imageFile) {
              formData.append("image", imageFile);
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

        {/* image upload */}
        <FileInput
          label="Post Image"
          accept="image/*"
          placeholder="Choose an image"
          value={imageFile}
          onChange={setImageFile}
          error={actionState?.error?.image}
          clearable
        />

        {imagePreviewUrl && (
          <div className="relative h-40 w-full max-w-md overflow-hidden rounded border border-gray-300">
            <img
              src={imagePreviewUrl}
              alt={postData?.title || "Post image preview"}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* isProtected */}
        <Checkbox
          label="Protected Post"
          name="isProtected"
          value="on"
          classNames={{
            label: "font-medium",
            root: "mt-4",
          }}
          defaultChecked={postData?.isProtected ?? false}
          error={actionState?.error?.isProtected}
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
