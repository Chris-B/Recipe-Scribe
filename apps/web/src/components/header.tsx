import { ChefHat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MeasurementSystem } from "@recipe/shared";

interface HeaderProps {
  system: MeasurementSystem;
  onSystemChange: (system: MeasurementSystem) => void;
}

export function Header({ system, onSystemChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-medium text-foreground">Recipe Scribe</h2>
            <p className="text-sm text-muted-foreground">Notes to recipes, effortlessly</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">Units</span>
          <Select value={system} onValueChange={(v) => onSystemChange(v as MeasurementSystem)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">US</SelectItem>
              <SelectItem value="METRIC">Metric</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
