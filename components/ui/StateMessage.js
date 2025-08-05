import { dashboard } from '@/styles/dashboard';

// 공통 상태 메시지 컴포넌트 (로딩, 에러, 빈 상태)
const StateMessage = ({ title, type = 'loading', message, children }) => {
  const getMessageStyle = () => {
    switch (type) {
      case 'error':
        return 'text-red-500 dark:text-red-400';
      case 'empty':
        return 'text-gray-500 dark:text-neutral-400';
      case 'loading':
      default:
        return 'text-gray-500 dark:text-neutral-400';
    }
  };

  return (
    <div className={dashboard.sidebar.section.container}>
      <h4 className={dashboard.sidebar.section.title}>{title}</h4>
      <div className="text-center py-4">
        <div className={`text-sm ${getMessageStyle()}`}>
          {message}
        </div>
        {children}
      </div>
    </div>
  );
};

export default StateMessage;