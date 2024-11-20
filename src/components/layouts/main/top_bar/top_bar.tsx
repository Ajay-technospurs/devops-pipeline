import Logo from "./components/logo";
import SettingsComponent from "./components/settings";
import UserProfile from "./components/user";

// TopBar Component
const TopBar = () => (
  <div className="h-[42px] bg-secondary/90 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
    <div className="flex h-full items-center px-5 justify-between">
      <div className="flex items-center space-x-4">
        <Logo />
      </div>
      <h1 className="text-lg font-bold text-foreground">Loreum Epsum</h1>
      <div className="flex items-center  divide-x-2">
        <SettingsComponent />
        <UserProfile />
      </div>
    </div>
  </div>
);
export default TopBar;
