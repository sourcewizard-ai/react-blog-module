import React from 'react';

export interface FakeTaskProps {
  children?: React.ReactNode;
  taskId?: string;
  title?: string;
  status?: string;
  assignee?: string;
  priority?: 'Low' | 'Normal' | 'High' | 'Critical';
  description?: string;
}

const FakeTask: React.FC<FakeTaskProps> = ({
  children,
  taskId = '',
  title = '',
  status = 'Open',
  assignee = '',
  priority = 'Normal',
  description = ''
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-400/10 text-red-200';
      case 'High': return 'bg-orange-400/10 text-orange-200';
      case 'Normal': return 'bg-blue-400/10 text-blue-200';
      case 'Low': return 'bg-gray-400/10 text-gray-200';
      default: return 'bg-gray-400/10 text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done': return 'bg-green-400/10 text-green-200';
      case 'in progress': return 'bg-blue-400/10 text-blue-200';
      case 'new': return 'bg-purple-400/10 text-purple-200';
      case 'open': return 'bg-gray-400/10 text-gray-200';
      default: return 'bg-gray-400/10 text-gray-200';
    }
  };

  return (
    <div className="my-8 mx-auto max-w-[95%] md:max-w-[95%] lg:max-w-[95%]">
      <div className="p-6 rounded-lg bg-gray-700/10 border border-gray-500/20 shadow-sm">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="font-mono text-sm text-gray-300">{taskId}</span>
            {title && (
              <h2 className="text-lg font-semibold text-gray-100 m-0">
                {title}
              </h2>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
            {assignee && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400/10 text-gray-200">
                👤 {assignee}
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
              ⚡ {priority}
            </span>
          </div>

          {/* Description if provided */}
          {description && (
            <div className="text-gray-200 text-sm leading-relaxed">
              {description}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-gray max-w-none prose-p:text-gray-200 prose-li:text-gray-200 prose-h3:text-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeTask; 
