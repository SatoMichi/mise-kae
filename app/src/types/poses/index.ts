import { PoseDefinition } from '../poses';
import { HandsupPose } from './handsup';
import { TPose } from './t-pose';
import { PeacePose } from './peace';
import { HiPose } from './hi';
import { GenbaNekoPose } from './genba-neko';
import { DoublePiecePose } from './double-piece';

// デフォルトのポーズ定義
export const DefaultPoses: { [key: string]: PoseDefinition } = {
  'tpose': {
    name: 'Tポーズ',
    description: '両腕を横に伸ばしたTポーズ',
    pose: TPose
  },
  'hi': {
    name: 'はーい！',
    description: '右手を上げて挨拶するポーズ',
    pose: HiPose
  },
  'genba-neko': {
    name: '現場猫',
    description: '現場猫のポーズ',
    pose: GenbaNekoPose
  },
  'double-piece': {
    name: 'ダブルピース',
    description: '両手でピースサインをするポーズ',
    pose: DoublePiecePose
  }
};

// デバッグ用：ポーズの定義を確認
console.log('DefaultPoses定義:', {
  keys: Object.keys(DefaultPoses),
  entries: Object.entries(DefaultPoses).map(([key, pose]) => ({
    key,
    name: pose.name,
    description: pose.description
  }))
}); 
