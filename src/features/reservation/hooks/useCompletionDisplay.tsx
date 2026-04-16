import { LuCheck, LuX, LuPackage } from 'react-icons/lu';

export const useCompletionDisplay = (type: string | undefined) => {
  const getDefaultMessage = () => {
    switch (type) {
      case 'cancel':
        return '予約キャンセルが完了しました';
      case 'return':
        return '予約返却が完了しました';
      case 'reserve':
      default:
        return '予約申請が完了しました';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'cancel':
        return <LuX size="4rem" />;
      case 'return':
        return <LuPackage size="4rem" />;
      case 'reserve':
      default:
        return <LuCheck size="4rem" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'cancel':
        return 'red.500';
      case 'return':
        return 'blue.500';
      case 'reserve':
      default:
        return 'green.500';
    }
  };

  return { getDefaultMessage, getIcon, getColor };
};
