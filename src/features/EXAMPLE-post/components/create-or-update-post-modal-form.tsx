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
import Image from "next/image";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    postData?.image || null,
  );
  const [fileInputId] = useState(
    `file-input-${Math.random().toString(36).substring(2, 11)}`,
  );

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
  const handleThumbnailChange = useCallback(
    (file: File | null) => {
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setThumbnailPreview(fileURL);
      }
    },
    [setThumbnailPreview],
  );

  // Update image preview when postData changes
  useEffect(() => {
    if (postData?.image) {
      setThumbnailPreview(postData.image);
    } else {
      setThumbnailPreview(null);
    }
  }, [postData]);

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

        {/* image upload */}
        <FileInput
          id={fileInputId}
          label="Post Image"
          accept="image/*"
          placeholder="Choose an image"
          error={actionState?.error?.image}
          name="image"
          onChange={handleThumbnailChange}
        />

        {thumbnailPreview && (
          <div className="w-full md:w-3/4 lg:w-1/2">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              width={500}
              height={500}
              className="h-full w-full cursor-pointer object-contain"
              onClick={() => document.getElementById(fileInputId)?.click()}
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
