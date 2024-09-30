import { type FormProps, Form as RACForm } from "react-aria-components"
import { twMerge } from "tailwind-merge"

// add the flex class to the Form component
export function Form(props: FormProps) {
  return <RACForm {...props} className={twMerge("flex", props.className)} />
}
