import * as THREE from 'three';
import { VRM } from '@pixiv/three-vrm';
import { createVRMLoader, loadVRM } from '../../utils/loaders';
import { VRMViewerProps } from '../../types/vrm';
import { PoseManager } from './PoseManager';
import { PoseControls } from './PoseControls';
// import { PoseUploader } from './PoseUploader'; // UI非表示のためコメントアウト

export class VRMViewer {
  private vrm: VRM | null = null;
  private loader = createVRMLoader();
  private poseManager: PoseManager | null = null;
  private poseControls: PoseControls | null = null;
  // private poseUploader: PoseUploader | null = null; // UI非表示のためコメントアウト

  constructor(
    private props: VRMViewerProps,
    private scene: THREE.Scene
  ) {}

  public async load() {
    try {
      // VRMモデルの読み込み
      this.vrm = await loadVRM(this.loader, this.props.modelPath);
      this.scene.add(this.vrm.scene);

      // VRMの読み込み後にポーズ管理を初期化
      this.poseManager = new PoseManager(this.vrm);
      this.poseControls = new PoseControls(this.poseManager);
      // ポーズアップロード機能は内部的に残すが、UIは非表示
      // this.poseUploader = new PoseUploader(this.poseManager);

      // モデルの位置とスケールを調整
      this.vrm.scene.position.set(0, 0, 0);  // 中心に配置
      this.vrm.scene.scale.set(1, 1, 1);     // デフォルトスケール
      
      // モデルの向きを調整（必要に応じて）
      this.vrm.scene.rotation.set(0, Math.PI, 0);  // 180度回転（モデルが後ろ向きの場合）

      // デバッグ用：モデルの位置とスケールをログ出力
      console.log('VRMモデルの位置:', this.vrm.scene.position);
      console.log('VRMモデルのスケール:', this.vrm.scene.scale);
      console.log('VRMモデルの回転:', this.vrm.scene.rotation);

      if (this.props.onLoad) {
        this.props.onLoad(this.vrm);
      }

      return this.vrm;
    } catch (error) {
      console.error('VRMの読み込みに失敗:', error);
      if (this.props.onError && error instanceof Error) {
        this.props.onError(error);
      }
      throw error;
    }
  }

  public getVRM() {
    return this.vrm;
  }

  public dispose() {
    if (this.vrm) {
      this.scene.remove(this.vrm.scene);
      this.vrm = null;
    }
    if (this.poseControls) {
      this.poseControls.dispose();
    }
    // ポーズアップロード機能は非表示にしているためコメントアウト
    // if (this.poseUploader) {
    //   this.poseUploader.dispose();
    // }
  }
} 
