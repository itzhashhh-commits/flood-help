import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getHelpSeekersPins } from "@/data-access/getHelpSeekersPins";
import { HelpSeekerResult } from "@/types";
import { Phone, PhoneCall } from "lucide-react";
import React from "react";

export default async function ListPage() {
  const { data: helpSeekers, error } = await getHelpSeekersPins();

  return (
    <div className="p-2 mt-2">
      <div className="flex flex-col gap-2">
        {helpSeekers &&
          helpSeekers.length > 0 &&
          helpSeekers.map((seeker: HelpSeekerResult) => (
            <Card key={seeker.id}>
              <CardHeader>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    {seeker.need === "place" && (
                      <>
                        <Badge variant={"destructive"}>Critical</Badge>
                        <Badge>Need a {seeker.need}</Badge>
                      </>
                    )}

                    {seeker.need === "food" && (
                      <Badge className="bg-orange-300">Need foods</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background text-sm font-semibold">
                      {seeker.name ? seeker.name.charAt(0).toUpperCase() : "H"}
                    </div>
                    <CardTitle>{seeker.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{seeker.details}</CardDescription>
              </CardContent>
              <Separator className="" />
              <CardFooter className="">
                <span className="flex gap-1 ">
                  <PhoneCall size={20} /> {seeker.phone}
                </span>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
