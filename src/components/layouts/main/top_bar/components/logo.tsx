import Image from "next/image";
import logo from "../../../../../../public/assets/logo.svg";
// Logo Component
const Logo = () => (
  <div className="flex items-center space-x-2">
    <Image
      src={logo}
      alt="logo"
    //   placeholder="blur"
      height={36}
      width={36}
    />
  </div>
);
export default Logo;
