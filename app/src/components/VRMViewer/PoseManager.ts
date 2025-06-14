import { VRM, VRMPose } from '@pixiv/three-vrm';
import { PoseDefinition, DefaultPoses } from '../../types/poses/index';
import * as THREE from 'three';

export class PoseManager {
  private vrm: VRM | null = null;
  private currentPose: VRMPose | null = null;
  private poses: { [key: string]: PoseDefinition } = { ...DefaultPoses };

  constructor(vrm: VRM) {
    this.vrm = vrm;
    console.log('PoseManager初期化 - 利用可能なポーズ:', {
      defaultPoses: DefaultPoses,
      loadedPoses: this.poses,
      poseKeys: Object.keys(this.poses),
      poseEntries: Object.entries(this.poses).map(([key, pose]) => ({
        key,
        name: pose.name,
        description: pose.description
      }))
    });

    // モデルの腰の位置情報を出力
    if (this.vrm.humanoid) {
      const hips = this.vrm.humanoid.getRawPose().hips;
      const hipsNode = this.vrm.humanoid.getBoneNode('hips');
      const worldPos = new THREE.Vector3();
      if (hipsNode) {
        hipsNode.getWorldPosition(worldPos);
      }
      console.log('モデルの腰の位置情報（詳細）:', {
        position: {
          x: hips?.position?.[0]?.toFixed(3),
          y: hips?.position?.[1]?.toFixed(3),
          z: hips?.position?.[2]?.toFixed(3)
        },
        rotation: {
          x: hips?.rotation?.[0]?.toFixed(3),
          y: hips?.rotation?.[1]?.toFixed(3),
          z: hips?.rotation?.[2]?.toFixed(3),
          w: hips?.rotation?.[3]?.toFixed(3)
        },
        bonePosition: hipsNode ? {
          x: hipsNode.position.x.toFixed(3),
          y: hipsNode.position.y.toFixed(3),
          z: hipsNode.position.z.toFixed(3)
        } : null,
        worldPosition: {
          x: worldPos.x.toFixed(3),
          y: worldPos.y.toFixed(3),
          z: worldPos.z.toFixed(3)
        }
      });
    }
  }

  /**
   * ポーズを適用します
   */
  public applyPose(pose: VRMPose, isJsonUpload: boolean = false) {
    if (!this.vrm?.humanoid) {
      console.error('VRMモデルまたはHumanoidが存在しません');
      return;
    }

    // 現在のポーズを取得（デバッグ用）
    const beforePose = this.vrm.humanoid.getRawPose();
    console.log('適用前のポーズ:', {
      isJsonUpload,
      currentBones: Object.keys(beforePose),
      fingerBones: {
        leftIndex: beforePose.leftIndexProximal,
        rightIndex: beforePose.rightIndexProximal
      }
    });

    // 毎回リセットして前のポーズの影響を完全に除去
    console.log('ポーズをリセットします');
    // 全ての関節をリセット（Tポーズに戻す）
    const resetPose: VRMPose = {
      // 上半身
      leftShoulder: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightShoulder: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftUpperArm: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightUpperArm: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftLowerArm: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightLowerArm: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftHand: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightHand: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      // 体幹部
      spine: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      chest: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      upperChest: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      neck: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      head: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      // 下半身
      hips: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftUpperLeg: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightUpperLeg: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftLowerLeg: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightLowerLeg: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftFoot: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightFoot: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      // 左手の指の関節
      leftThumbProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftThumbIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftThumbDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftIndexProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftIndexIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftIndexDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftMiddleProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftMiddleIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftMiddleDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftRingProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftRingIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftRingDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftLittleProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftLittleIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      leftLittleDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      // 右手の指の関節
      rightThumbProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightThumbIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightThumbDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightIndexProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightIndexIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightIndexDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightMiddleProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightMiddleIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightMiddleDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightRingProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightRingIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightRingDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightLittleProximal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightLittleIntermediate: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightLittleDistal: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      // 目（動かさない）
      leftEye: { rotation: [0, 0, 0, 1], position: [0, 0, 0] },
      rightEye: { rotation: [0, 0, 0, 1], position: [0, 0, 0] }
    };

    console.log('リセットポーズを適用します:', {
      resetBones: Object.keys(resetPose),
      fingerBones: {
        leftIndex: resetPose.leftIndexProximal,
        rightIndex: resetPose.rightIndexProximal
      }
    });

    this.vrm.humanoid.setRawPose(resetPose);

    // リセット後のポーズを確認
    const afterResetPose = this.vrm.humanoid.getRawPose();
    console.log('リセット後のポーズ:', {
      resetBones: Object.keys(afterResetPose),
      fingerBones: {
        leftIndex: afterResetPose.leftIndexProximal,
        rightIndex: afterResetPose.rightIndexProximal
      }
    });



    // アップロードされたポーズで定義されている関節を確認
    const definedBones = new Set(Object.keys(pose));
    console.log('定義されている関節:', Array.from(definedBones));

    // 新しいポーズを適用
    console.log('新しいポーズを適用します:', {
      isJsonUpload,
      bones: Object.keys(pose),
      hasRotation: Object.entries(pose).some(([_, data]) => data.rotation !== undefined),
      hasPosition: Object.entries(pose).some(([_, data]) => data.position !== undefined)
    });

    this.currentPose = pose;
    this.vrm.humanoid.setRawPose(pose);

    // ポーズ適用後の状態を確認
    const newPose = this.vrm.humanoid.getRawPose();
    console.log('ポーズ適用後の状態:', {
      hips: newPose.hips,
      leftUpperArm: newPose.leftUpperArm,
      rightUpperArm: newPose.rightUpperArm,
      leftHand: newPose.leftHand,
      rightHand: newPose.rightHand,
      fingerBones: {
        // 左手の指
        leftIndex: {
          defined: definedBones.has('leftIndexProximal'),
          value: newPose.leftIndexProximal
        },
        leftMiddle: {
          defined: definedBones.has('leftMiddleProximal'),
          value: newPose.leftMiddleProximal
        },
        // 右手の指
        rightIndex: {
          defined: definedBones.has('rightIndexProximal'),
          value: newPose.rightIndexProximal
        },
        rightMiddle: {
          defined: definedBones.has('rightMiddleProximal'),
          value: newPose.rightMiddleProximal
        }
      }
    });
  }

  /**
   * 定義済みのポーズを適用します
   */
  public applyPoseByName(name: string) {
    console.log('ポーズ名で適用:', name, {
      availablePoses: Object.entries(this.poses).map(([key, pose]) => ({
        key,
        name: pose.name,
        description: pose.description
      }))
    });

    // まずキーで検索
    if (this.poses[name]) {
      console.log('ポーズをキーで見つけました:', {
        key: name,
        name: this.poses[name].name,
        description: this.poses[name].description
      });
      this.applyPose(this.poses[name].pose);
      return;
    }

    // 次にポーズ名で検索
    const poseEntry = Object.entries(this.poses).find(([_, pose]) => pose.name === name);
    if (poseEntry) {
      const [key, pose] = poseEntry;
      console.log('ポーズを名前で見つけました:', {
        key,
        name: pose.name,
        description: pose.description,
        leftUpperArm: pose.pose.leftUpperArm?.rotation,
        rightUpperArm: pose.pose.rightUpperArm?.rotation
      });
      this.applyPose(pose.pose);
    } else {
      console.error('ポーズが見つかりません:', name, {
        availablePoses: Object.entries(this.poses).map(([key, pose]) => ({
          key,
          name: pose.name,
          description: pose.description
        }))
      });
    }
  }

  /**
   * 利用可能なポーズの一覧を取得します
   */
  public getPoseList(): PoseDefinition[] {
    return Object.values(this.poses);
  }

  /**
   * 現在のポーズを保存します
   */
  public savePose(name: string, description: string = '') {
    if (!this.currentPose) return;
    
    this.poses[name] = {
      name,
      description,
      pose: { ...this.currentPose }
    };
  }

  /**
   * 2つのポーズ間を補間します
   */
  public interpolatePose(from: VRMPose, to: VRMPose, t: number): VRMPose {
    const result: VRMPose = {};

    // すべてのボーンに対して補間を実行
    Object.keys(from).forEach((boneName) => {
      const fromBone = from[boneName as keyof VRMPose];
      const toBone = to[boneName as keyof VRMPose];

      if (fromBone && toBone) {
        // 回転の補間（クォータニオン）
        const fromRotation = fromBone.rotation;
        const toRotation = toBone.rotation;
        const interpolatedRotation = [
          fromRotation[0] + (toRotation[0] - fromRotation[0]) * t,
          fromRotation[1] + (toRotation[1] - fromRotation[1]) * t,
          fromRotation[2] + (toRotation[2] - fromRotation[2]) * t,
          fromRotation[3] + (toRotation[3] - fromRotation[3]) * t
        ];

        // 位置の補間（線形）
        const fromPosition = fromBone.position;
        const toPosition = toBone.position;
        const interpolatedPosition = [
          fromPosition[0] + (toPosition[0] - fromPosition[0]) * t,
          fromPosition[1] + (toPosition[1] - fromPosition[1]) * t,
          fromPosition[2] + (toPosition[2] - fromPosition[2]) * t
        ];

        result[boneName as keyof VRMPose] = {
          rotation: interpolatedRotation,
          position: interpolatedPosition
        };
      }
    });

    return result;
  }

  /**
   * 現在のポーズを取得します
   */
  public getCurrentPose(): VRMPose | null {
    return this.currentPose;
  }

  /**
   * 保存されたポーズを削除します
   */
  public deletePose(name: string) {
    delete this.poses[name];
  }
} 
 