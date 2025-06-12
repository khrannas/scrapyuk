import { Header } from "./Header";
import { LeftPanel } from "./LeftPanel";
import { MainCanvas } from "./MainCanvas";
import { RightPanel } from "./RightPanel";

export function AppLayout() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        <MainCanvas />
        <RightPanel />
      </div>
    </div>
  );
}