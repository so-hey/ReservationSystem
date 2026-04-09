import { Field, HStack, Stack, Text, Textarea, TextareaProps, Box } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

interface FormTextareaProps extends TextareaProps {
  label: string;
  formLabel: string;
  patternValue?: RegExp;
  patternMessage?: string;
}

/**
 * フォームテキストエリアコンポーネント（レスポンシブ対応）
 */
export const FormTextarea = ({
  label,
  formLabel,
  patternValue,
  patternMessage,
  ...props
}: FormTextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Field.Root required>
      {/* デスクトップ用レイアウト */}
      <HStack w="full" display={{ base: 'none', md: 'flex' }}>
        <Stack w="30%">
          <Field.Label>
            {label}
            <Field.RequiredIndicator />
          </Field.Label>
        </Stack>
        <Stack w="70%">
          <Textarea
            w="full"
            rows={3}
            _placeholder={{ color: 'gray.300' }}
            {...(register(formLabel, {
              required: props.required ? '必須項目です' : false,
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
            {...(register(formLabel, {
              required: props.required ? '必須項目です' : false,
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
