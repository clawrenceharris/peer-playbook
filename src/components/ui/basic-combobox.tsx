import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxEmpty,
  ComboboxContent,
  ComboboxInput,
} from "./combobox";

type ComboboxBasicProps = {
  items: string[];
  placeholder?: string;
};
export function ComboboxBasic({ items, placeholder }: ComboboxBasicProps) {
  return (
    <Combobox items={items}>
      <ComboboxInput placeholder={placeholder} />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
