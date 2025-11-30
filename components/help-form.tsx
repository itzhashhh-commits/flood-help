"use client";

import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { askHelpFormSubmit } from "@/actions/ask-help-action";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMapPositionStore } from "@/store/mapPositionStore";
import { toast } from "sonner";
import Image from "next/image";
import helpImage from "@/assets/icons/help.png";

export default function HelpForm() {
  const { position } = useMapPositionStore();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (position) {
      formData.append(
        "coordinates",
        JSON.stringify({ lat: position.lat, lng: position.lng })
      );
    }

    startTransition(async () => {
      const { error, data } = await askHelpFormSubmit(formData);

      if (error) {
        toast.error(`Error submitting form: ${error}`);
      } else {
        toast.success("You will be helped soon! Stay safe!");
      }
      setOpen(false); // close dialog after submit
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* you likely already have a trigger somewhere; keep or adjust as needed */}
      <DialogTrigger asChild>
        <Button
          className="bg-red-500 flex   font-medium "
          onClick={() => setOpen(true)}
        >
          <Image
            src={helpImage}
            alt="Help Icon"
            className="object-cover"
            width={24}
            height={24}
          />
          Ask for help
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ask for help</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="location">Your Location</FieldLabel>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={"Current Location"}
                  disabled
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Your Name</FieldLabel>
                <Input id="name" name="name" type="text" />
              </Field>
              <Field>
                <FieldLabel htmlFor="people">How many people there?</FieldLabel>
                <Input id="people" name="people" type="number" max={200} />
              </Field>
              <Field>
                <FieldLabel htmlFor="people">What do you want?</FieldLabel>
                <Select name="need">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Need?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="place">Place to move</SelectItem>
                    <SelectItem value="food">Foods and water</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input id="phone" name="phone" type="text" />
              </Field>
              <Field>
                <FieldLabel htmlFor="details">
                  Write more details about your situation (optional)
                </FieldLabel>
                <Textarea id="details" name="details" />
              </Field>
            </FieldSet>
          </FieldGroup>

          <DialogFooter>
            <Field orientation="horizontal" className="flex justify-end w-full">
              <Button type="submit">Submit</Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </Field>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
