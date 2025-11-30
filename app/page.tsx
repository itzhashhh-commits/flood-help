import GoogleMap from "@/components/google-map";
import HelpDialog from "@/components/HelpDialog";
import { getHelpSeekersPins } from "@/data-access/getHelpSeekersPins";

export default async function HomePage() {
  const { data: helpSeekers, error } = await getHelpSeekersPins();

  return <GoogleMap helpSeekers={helpSeekers ?? []} />;
}
