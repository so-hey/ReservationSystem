import { Field, Input, InputProps, Stack, Text, Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

interface InputValueProps extends InputProps {
  label: string;
  formLabel: string;
  patternValue?: RegExp;
  patternMessage?: string;
  required?: boolean;
}

export function InputValue({
  label,
  formLabel,
  patternValue,
  patternMessage,
  required,
  ...props
}: InputValueProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Field.Root w="full" required={required}>
      {/* レスポンシブ対応の統一レイアウト */}
      <Stack w="full" gap={1}>
        {label && (
          <Box>
            <Field.Label>
              {label}
              <Field.RequiredIndicator />
            </Field.Label>
          </Box>
        )}
        <Box>
          <Input
            _placeholder={{ color: 'gray.300' }}
            {...register(formLabel, {
              required: required ? '必須項目です' : false,
              ...(patternValue &&
                patternMessage && {
                  pattern: {
                    value: patternValue,
                    message: patternMessage,
                  },
                }),
            })}
            {...props}
          />
          {errors[formLabel] && (
            <Text textStyle="xs" color="red.500">
              {errors[formLabel]?.message?.toString()}
            </Text>
          )}
        </Box>
      </Stack>
    </Field.Root>
  );
}
