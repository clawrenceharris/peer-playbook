import { ControllerProps, FieldValues } from "react-hook-form";
export type FieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TElement extends React.ElementType = "input"
> = Omit<ControllerProps<TFieldValues>, "render" | "control"> &
  Omit<React.ComponentPropsWithoutRef<TElement>, "name" | "defaultValue"> & {
    label: string;
    description?: string;
    isOptional?: boolean;
    showsLabel?: boolean;
    fieldClassName?: string;
  };