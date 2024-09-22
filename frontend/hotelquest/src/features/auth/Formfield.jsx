import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FormField({ label, id, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}
