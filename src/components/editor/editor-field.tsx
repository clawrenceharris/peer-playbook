import { Value } from "platejs";
import { Plate, PlateContent, usePlateEditor } from "platejs/react";

export interface EditorFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>,"onChange"> {
  /**
   * The current Plate Value. Should be an array of Plate nodes.
   */
  value?: Value;
 
  /**
   * Called when the editor value changes.
   */
  onChange?: (value: Value) => void;
 
  /**
   * Placeholder text to display when editor is empty.
   */
  placeholder?: string;
}
 
export function EditorField({
  value,
  onChange,
  placeholder = "Type here...",
  ...props
}: EditorFieldProps) {
  // We create our editor instance with the provided initial `value`.
  const editor = usePlateEditor({
    value: value ?? [
      { type: "p", children: [{ text: "" }] }, // Default empty paragraph
    ],
  });
 
  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        // Sync changes back to the caller via onChange prop
        onChange?.(value);
      }}
      {...props}
    >
      <PlateContent placeholder={placeholder} />
    </Plate>
  );
}