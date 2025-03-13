
import { useTheme } from "@/contexts/ThemeContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <Label>Theme Preference</Label>
      <RadioGroup
        value={theme}
        onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
        className="grid grid-cols-3 gap-4"
      >
        <Label
          htmlFor="light"
          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
            theme === "light" ? "border-primary" : ""
          }`}
        >
          <RadioGroupItem value="light" id="light" className="sr-only" />
          <Sun className="mb-3 h-6 w-6" />
          <span className="text-sm font-medium">Light</span>
        </Label>
        <Label
          htmlFor="dark"
          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
            theme === "dark" ? "border-primary" : ""
          }`}
        >
          <RadioGroupItem value="dark" id="dark" className="sr-only" />
          <Moon className="mb-3 h-6 w-6" />
          <span className="text-sm font-medium">Dark</span>
        </Label>
        <Label
          htmlFor="system"
          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground ${
            theme === "system" ? "border-primary" : ""
          }`}
        >
          <RadioGroupItem value="system" id="system" className="sr-only" />
          <Laptop className="mb-3 h-6 w-6" />
          <span className="text-sm font-medium">System</span>
        </Label>
      </RadioGroup>
    </div>
  );
}
