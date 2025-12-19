import { DynamicForm } from "@/shared/components/dynamic-form"
import { questsConfig } from "./lib/questsConfig"

export const index = () => {
  return (
    <DynamicForm
      config={questsConfig}
      action={qu}>
  )
}
