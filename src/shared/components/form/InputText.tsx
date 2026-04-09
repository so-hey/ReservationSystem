import { Field, Stack, Text, Textarea, TextareaProps, Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

interface InputTextProps extends TextareaProps {
  label: string;
  formLabel: string;
  patternValue?: RegExp;
  patternMessage?: string;
}

export function InputText({
  label,
  formLabel,
  patternValue,
  patternMessage,
  ...props
}: InputTextProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Field.Root required={props.required}>
      {/* レスポンシブ対応の統一レイアウト */}
      <Stack w="full" gap={1}>
        <Box>
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
        </Box>
        <Box>
          <Textarea
            w="full"
            rows={3}
            _placeholder={{ color: 'gray.300' }}
            {...register(formLabel, {
              required: props.required ? '必須項目です' : false,
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
