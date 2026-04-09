import { Field, HStack, Input, InputProps, Stack, Text, Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

interface FormInputProps extends InputProps {
  label: string;
  formLabel: string;
  patternValue?: RegExp;
  patternMessage?: string;
  required?: boolean;
}

/**
 * フォーム入力コンポーネント（レスポンシブ対応）
 */
export const FormInput = ({
  label,
  formLabel,
  patternValue,
  patternMessage,
  required,
  ...props
}: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
        <Stack w="70%">
          <Input
            _placeholder={{ color: 'gray.300' }}
            {...(register(formLabel, {
              required: required ? '必須項目です' : false,
              pattern:
                patternValue && patternMessage
                  ? {
                      value: patternValue,
                      message: patternMessage,
                    }
                  : undefined,
            }) as any)}
            {...props}
          />
          {errors[formLabel] && (
            <Text textStyle="xs" color="red.500">
              {errors[formLabel]?.message?.toString()}
            </Text>
          )}
        </Stack>
      </HStack>

      {/* モバイル用レイアウト */}
      <Stack w="full" display={{ base: 'flex', md: 'none' }} gap={1}>
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
            {...(register(formLabel, {
              required: required ? '必須項目です' : false,
              pattern:
                patternValue && patternMessage
                  ? {
                      value: patternValue,
                      message: patternMessage,
                    }
                  : undefined,
            }) as any)}
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
};
