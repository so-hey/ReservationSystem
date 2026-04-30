import {
  Field,
  HStack,
  Select,
  SelectRootProps,
  Spacer,
  Stack,
  Text,
  createListCollection,
  Box,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

interface SelectItemsProps extends Omit<SelectRootProps, 'collection'> {
  label: string;
  formLabel: string;
  items: string[];
  values?: string[];
  description?: string;
  required?: boolean;
}

export function SelectItems({
  label,
  formLabel,
  items,
  values,
  description,
  required,
  ...props
}: SelectItemsProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const selectItems = createListCollection({
    items:
      values && values.length === items.length
        ? items.map((_, idx) => {
            return {
              label: items[idx],
              value: values[idx],
            };
          })
        : items.map((item) => {
            return {
              label: item,
              value: item,
            };
          }),
  });

  return (
    <Field.Root w="full" required={required}>
      {/* デスクトップ用レイアウト */}
      <HStack w="full" display={{ base: 'none', md: 'flex' }}>
        <Stack w="30%">
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
        </Stack>
        <Stack w="25%">
          <Controller
            name={formLabel}
            control={control}
            rules={{ required: required ? '必須項目です' : false }}
            render={({ field }) => (
              <Select.Root
                collection={selectItems}
                value={field.value ? [field.value] : []}
                onValueChange={(value: { value: string[] }) => field.onChange(value.value[0])}
                {...props}
              >
                <Select.HiddenSelect />
                <Select.Label />

                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                    <Select.ClearTrigger />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                  <Select.Content>
                    {selectItems.items.map((selectItem: { label: string; value: string }) => (
                      <Select.Item key={selectItem.value} item={selectItem}>
                        {selectItem.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            )}
          />
          {errors[formLabel] && (
            <Text color="red.500" fontSize="sm">
              {errors[formLabel]?.message as string}
            </Text>
          )}
        </Stack>
        <Spacer />
        {!props.disabled && <Text fontSize="sm">{description}</Text>}
        <Spacer />
      </HStack>

      {/* モバイル用レイアウト */}
      <Stack w="full" display={{ base: 'flex', md: 'none' }} gap={0}>
        <Box>
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
        </Box>
        <Box>
          <Controller
            name={formLabel}
            control={control}
            rules={{ required: required ? '必須項目です' : false }}
            render={({ field }) => (
              <Select.Root
                collection={selectItems}
                value={field.value ? [field.value] : []}
                onValueChange={(value: { value: string[] }) => field.onChange(value.value[0])}
                {...props}
              >
                <Select.HiddenSelect />
                <Select.Label />

                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                    <Select.ClearTrigger />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                  <Select.Content>
                    {selectItems.items.map((selectItem: { label: string; value: string }) => (
                      <Select.Item key={selectItem.value} item={selectItem}>
                        {selectItem.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            )}
          />
          {errors[formLabel] && (
            <Text color="red.500" fontSize="sm">
              {errors[formLabel]?.message as string}
            </Text>
          )}
        </Box>
        {!props.disabled && (
          <Box>
            <Text fontSize="sm" textAlign="right">
              {description}
            </Text>
          </Box>
        )}
      </Stack>
    </Field.Root>
  );
}
