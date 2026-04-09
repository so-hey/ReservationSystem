import { Field, For, HStack, Stack, Table, useBreakpointValue } from '@chakra-ui/react';
import { AvailableTime } from '@/shared/types';

interface ShowAvailableTimeProps {
  items: AvailableTime[];
  split?: number;
}

export function ShowAvailableTime({ items, split = 1 }: ShowAvailableTimeProps) {
  // レスポンシブな列数を設定（スマホは1列、デスクトップはsplitプロップの値）
  const responsiveSplit = useBreakpointValue({ base: 1, md: split }) || 1;

  return (
    <>
      {items ? (
        <Field.Root>
          <HStack w="full">
            <For each={Array.from({ length: responsiveSplit }, (_, i) => i)}>
              {(i) => {
                return (
                  <Stack w={`${100 / responsiveSplit}%`} key={i}>
                    <Table.Root size="sm" variant="outline" showColumnBorder borderRadius="sm">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader textAlign="center">時間</Table.ColumnHeader>
                          <Table.ColumnHeader textAlign="center">利用可能</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {items
                          .slice(
                            (items.length / responsiveSplit) * i,
                            (items.length / responsiveSplit) * (i + 1),
                          )
                          .map((item, i) => {
                            return (
                              <Table.Row key={i}>
                                <Table.Cell textAlign="center">
                                  {`${item.startTime} - ${item.endTime}`}
                                </Table.Cell>
                                <Table.Cell
                                  textAlign="center"
                                  color={
                                    item.isAvailable === undefined
                                      ? 'gray.500'
                                      : item.isAvailable
                                      ? 'green.600'
                                      : 'red.600'
                                  }
                                  fontWeight="bold"
                                >
                                  {item.isAvailable === undefined
                                    ? ''
                                    : item.isAvailable
                                    ? '〇'
                                    : '✕'}
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    </Table.Root>
                  </Stack>
                );
              }}
            </For>
          </HStack>
        </Field.Root>
      ) : (
        <></>
      )}
    </>
  );
}
