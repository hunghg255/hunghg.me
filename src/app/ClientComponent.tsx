"use client";

import React from "react";

import dynamic from "next/dynamic";

const LogArt = dynamic(() => import("@/components/LogArt/LogArt"), {
  ssr: false,
});

const ClientComponent = () => {
  return (
    <>
      <LogArt />
    </>
  );
};

export default ClientComponent;
