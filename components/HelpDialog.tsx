import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import AskHelpButton from "./AskHelpButton";

import HelpForm from "./help-form";

export default function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AskHelpButton />
      </DialogTrigger>
      <DialogContent>
        <HelpForm />
      </DialogContent>
    </Dialog>
  );
}
