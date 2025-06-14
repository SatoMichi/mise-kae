import React, { useState } from 'react';
import { PoseUploader } from './PoseUploader';
import { PoseList } from './PoseList';
import { PoseDefinition } from '../utils/PoseFileManager';
import { Pose } from '../utils/Pose';

interface PosePanelProps {
  onPoseSelect?: (pose: PoseDefinition) => void;
}

export const PosePanel: React.FC<PosePanelProps> = ({ onPoseSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handlePoseLoaded = (poseDef: PoseDefinition) => {
    onPoseSelect?.(poseDef);
  };

  const handlePoseSelect = (poseDef: PoseDefinition) => {
    const pose = Pose.getInstance();
    pose.setPose(poseDef.pose);
    onPoseSelect?.(poseDef);
  };

  return (
    <div className="fixed right-4 top-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-gray-50 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-medium text-gray-900">ポーズ管理</h2>
        <button
          className="p-1 rounded-full hover:bg-gray-200"
          title={isExpanded ? 'パネルを閉じる' : 'パネルを開く'}
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* ポーズアップロード機能は内部的に残すが、UIは非表示
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              ポーズをアップロード
            </h3>
            <PoseUploader onPoseLoaded={handlePoseLoaded} />
          </div>
          */}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              保存されているポーズ
            </h3>
            <PoseList onPoseSelect={handlePoseSelect} />
          </div>
        </div>
      )}
    </div>
  );
}; 
