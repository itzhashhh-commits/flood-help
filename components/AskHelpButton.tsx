import React from "react";
import { Button } from "./ui/button";
import helpIcon from "@/assets/icons/help.png";
import Image from "next/image";

export default function AskHelpButton() {
  return (
    <Button className="h-[50px] text-lg flex bg-red-500 font-semibold">
      <Image src={helpIcon} alt="Help Icon" className="w-4 h-4 mr-2" />
      Ask for Help
    </Button>
  );
}
