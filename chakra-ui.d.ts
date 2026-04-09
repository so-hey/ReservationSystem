// src/chakra-ui.d.ts

// Chakra UIのコアモジュールから型定義をインポート
import '@chakra-ui/react';

// '@chakra-ui/react' モジュールの型定義を拡張する
// これにより、すべてのChakra UIコンポーネントが 'sx' プロパティを受け入れられるようになる
declare module '@chakra-ui/react' {
  interface ChakraComponent<
    T extends React.ElementType,
    P extends object = {}
  > extends React.ForwardRefExoticComponent<
      MergeWithAs<React.ComponentPropsWithoutRef<T>, P> & {
        sx?: SystemStyleObject; // ここで 'sx' プロパティを追加
      } & HTMLChakraProps<T>
    > {}
}

// SystemStyleObject をインポートし、sx の型定義に利用
import { SystemStyleObject } from '@chakra-ui/react';

// TableCellProps の型定義を拡張して 'sx' を含める
// これは、Table.Cell (HTMLの <td>) が sx を持つようにするために必要
declare module '@chakra-ui/react' {
  interface TableCellProps {
    sx?: SystemStyleObject;
  }
}