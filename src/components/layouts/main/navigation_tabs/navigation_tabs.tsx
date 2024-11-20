import {
  Code,
  Rocket,
  LineChart,
  Database,
  Layout,
  Settings,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NavigationTabs = () => {
  const tabs = [
    { id: "develop", label: "Develop", icon: Code },
    { id: "deploy", label: "Deploy", icon: Rocket },
    { id: "monitor", label: "Monitor", icon: LineChart },
    { id: "tab4", label: "Tab 4", icon: Database },
    { id: "tab5", label: "Tab 5", icon: Layout },
    { id: "tab6", label: "Tab 6", icon: Settings },
  ];

  return (
    <div className="border-b border-border">
      <div className="px-4">
        <Tabs defaultValue="develop" className="w-full h-[36px] flex items-center">
          <TabsList className=" bg-transparent">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  // data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                  className=" px-4 text-sm"
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
export default NavigationTabs;