"use client";

import { PhoneIcon } from "lucide-react";

import { useIsClient } from "@/hooks/use-is-client";
import { decodePhoneNumber, formatPhoneNumber } from "@/utils/string";

import { IntroItem } from "./intro-item";

export function PhoneItem({ phoneNumber }: { phoneNumber: string }) {
  const isClient = useIsClient();
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber);

  return (
    <IntroItem
      icon={PhoneIcon}
      content={
        isClient ? formatPhoneNumber(phoneNumberDecoded) : "[Phone protected]"
      }
      href={isClient ? `tel:${phoneNumberDecoded}` : "#"}
    />
  );
}
