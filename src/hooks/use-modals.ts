"use client";
import { useModal } from "@/components/providers";
import { SESSION_MODAL_TYPES } from "@/features/sessions/components";
import {
  ConfirmationModalProps,
  CreateSessionModalProps,
} from "@/lib/modals/types";
import { useMemo } from "react";

export function useModals() {
  const { openModal, closeModal } = useModal();

  const modals = useMemo(() => {
    return {
      ["confirmation"]: {
        open: (props: ConfirmationModalProps) => {
          openModal<ConfirmationModalProps>("confirmation", {
            ...props,
            isAlert: true,
            onCancel: closeModal,
          });
        },
      },
      [SESSION_MODAL_TYPES.CREATE]: {
        open: (props: CreateSessionModalProps) => {
          openModal<CreateSessionModalProps>(SESSION_MODAL_TYPES.CREATE, {
            ...props,
            onCancel: closeModal,
          });
        },
      },
    };
  }, [closeModal, openModal]);
  return { modals };
}
