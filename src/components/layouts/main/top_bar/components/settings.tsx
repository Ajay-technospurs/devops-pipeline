
import Image from "next/image";

// Settings Component
const SettingsComponent = () => (
    // <Button variant="ghost" size={"lg"} className="h-[36px] w-[36px] p-[2px]">
    <div className="px-4">
        <Image src={"/assets/settings.svg"} alt={"settings"} width={28} height={28} />
    </div>
    // </Button>
  );
  export default SettingsComponent;