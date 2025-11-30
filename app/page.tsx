import GoogleMap from "@/components/google-map";
import HelpDialog from "@/components/HelpDialog";
import { getHelpSeekersPins } from "@/data-access/getHelpSeekersPins";

export default async function HomePage() {
  const { data: helpSeekers, error } = await getHelpSeekersPins();

  return (
    <div className="w-full h-screen relative p-2 mb:p-3 flex flex-col ">
      <div className="my-3 mx-3 flex justify-between w-auto items-center">
        <h1 className=" font-semibold text-xl flex-1 ">
          <span className="font-normal">Flood</span> Help Map
        </h1>
        <HelpDialog />
      </div>
      <div className="rounded-xl w-full flex-1 overflow-hidden">
        <GoogleMap helpSeekers={helpSeekers ?? []} />
        {/* <div className="absolute bottom-5 right-5">
          
        </div> */}
      </div>
    </div>
  );
}
