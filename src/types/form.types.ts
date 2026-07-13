import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

export interface InputFieldProps<
  T extends FieldValues,
  U extends Path<T>,
> extends Omit<React.ComponentProps<"input">, "name"> {
  label: string;
  name: U;
  showsDescription?: boolean;
  description?: string;
  showsLabel?: boolean;
  orientation?: "vertical" | "horizontal" | "responsive";
  className?: string;
  inputId?: string;
  renderInput?: ({
    field,
    fieldState,
    inputId,
  }: {
    field: ControllerRenderProps<T, U>;
    fieldState: ControllerFieldState;
    inputId: string;
  }) => React.ReactNode;
  showsRequired?: boolean;
  showsOptional?: boolean;
}
