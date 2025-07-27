"use client";

import React from "react";

import dynamic from "next/dynamic";

const Plum = dynamic(() => import("@/components/Plum/Plum"), {
  ssr: false,
});
const LogArt = dynamic(() => import("@/components/LogArt/LogArt"), {
  ssr: false,
});

const ClientComponent = () => {
  return (
    <>
      <Plum />
      <LogArt />
    </>
  );
};

export default ClientComponent;
