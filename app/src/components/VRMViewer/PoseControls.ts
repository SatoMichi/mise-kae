import { PoseManager } from './PoseManager';
import { PoseDefinition } from '../../types/poses/index';

export class PoseControls {
  private container: HTMLDivElement;
  private poseSelect: HTMLSelectElement;

  constructor(private poseManager: PoseManager) {
    this.setupUI();
    this.updatePoseList();
  }

  private setupUI() {
    // メインコンテナ
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.top = '10px';
    this.container.style.right = '10px';
    this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    this.container.style.padding = '15px';
    this.container.style.borderRadius = '5px';
    this.container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    this.container.style.zIndex = '1000';
    this.container.style.width = '200px';

    // ポーズ選択セレクトボックス
    this.poseSelect = document.createElement('select');
    this.poseSelect.style.width = '100%';
    this.poseSelect.style.padding = '5px';
    this.poseSelect.addEventListener('change', () => {
      const selectedPose = this.poseSelect.value;
      console.log('選択されたポーズ（表示名）:', selectedPose);
      if (selectedPose) {
        // 表示名から内部名に変換
        let poseKey: string;
        switch (selectedPose) {
          case 'Tポーズ':
            poseKey = 'tpose';
            break;
          case 'はーい！':
            poseKey = 'hi';
            break;
          case '現場猫':
            poseKey = 'genba-neko';
            break;
          case 'ダブルピース':
            poseKey = 'double-piece';
            break;
          default:
            console.error('未知のポーズ:', selectedPose);
            return;
        }
        console.log('変換後の内部名:', poseKey);
        this.poseManager.applyPoseByName(poseKey);
      }
    });

    // UIの組み立て
    this.container.appendChild(this.poseSelect);

    // ドキュメントに追加
    document.body.appendChild(this.container);
  }

  private updatePoseList() {
    // 既存のオプションをクリア
    while (this.poseSelect.options.length > 0) {
      this.poseSelect.remove(0);
    }

    // デフォルトオプションを追加
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'ポーズを選択してください';
    this.poseSelect.appendChild(defaultOption);

    // 保存されたポーズを追加
    const poses = this.poseManager.getPoseList();
    console.log('利用可能なポーズ:', poses);
    poses.forEach((pose: PoseDefinition) => {
      const option = document.createElement('option');
      option.value = pose.name;  // 表示名をそのまま使用
      option.textContent = pose.name;  // 表示名をそのまま使用
      this.poseSelect.appendChild(option);
    });
  }

  public dispose() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
} 
 