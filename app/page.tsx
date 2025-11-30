import GoogleMap from "@/components/google-map";
import HelpDialog from "@/components/HelpDialog";
import { getHelpSeekersPins } from "@/data-access/getHelpSeekersPins";

export default async function HomePage() {
  const { data: helpSeekers, error } = await getHelpSeekersPins();

  return (
    <div className="w-full h-screen relative">
      <GoogleMap helpSeekers={helpSeekers ?? []} />
      <div className="absolute bottom-5 right-5">
        <HelpDialog />
      </div>
    </div>
  );
}
