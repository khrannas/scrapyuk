import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Settings, Layers, Move3D, Lightbulb } from "lucide-react";

export function RightPanel() {
  return (
    <div className="w-80 bg-panel-surface border-l border-border p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-heading flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-secondary-text">
            Select an object to view and edit its properties
          </div>

          {/* Object Properties Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Layer Controls</Label>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="layer-count" className="text-xs text-secondary-text">
                  Layer Count (1-10)
                </Label>
                <Slider
                  id="layer-count"
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[3]}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">Current: 3 layers</div>
              </div>

              <div>
                <Label htmlFor="layer-spacing" className="text-xs text-secondary-text">
                  Layer Spacing (mm)
                </Label>
                <Slider
                  id="layer-spacing"
                  min={1}
                  max={10}
                  step={0.5}
                  defaultValue={[2]}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">Current: 2mm</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Position and Size Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Move3D className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Position & Size</Label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="pos-x" className="text-xs text-secondary-text">X Position</Label>
                <Input id="pos-x" placeholder="0" className="mt-1 h-8" />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs text-secondary-text">Y Position</Label>
                <Input id="pos-y" placeholder="0" className="mt-1 h-8" />
              </div>
            </div>

            <div>
              <Label htmlFor="height" className="text-xs text-secondary-text">
                Height from Base (mm)
              </Label>
              <Slider
                id="height"
                min={0}
                max={50}
                step={1}
                defaultValue={[5]}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">Current: 5mm</div>
            </div>

            <div>
              <Label htmlFor="scale" className="text-xs text-secondary-text">
                Scale (%)
              </Label>
              <Slider
                id="scale"
                min={10}
                max={200}
                step={5}
                defaultValue={[100]}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">Current: 100%</div>
            </div>
          </div>

          <Separator />

          {/* Lighting Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Lighting</Label>
            </div>

            <div className="text-xs text-secondary-text">
              LED lights will be positioned on frame walls to create realistic shadows
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}