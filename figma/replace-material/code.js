// 批量替换素材插件
// 功能：将所有目标素材替换为源素材，同时保留目标节点的透明度、混合模式、旋转、约束等属性

figma.showUI(__html__, { width: 400, height: 400 });

figma.ui.onmessage = async (msg) => {
  // 一键分离所有实例
  if (msg.type === 'detach-all') {
    try {
      // 递归查找当前页面所有 InstanceNode
      const instances = figma.currentPage.findAll(
        (node) => node.type === 'INSTANCE'
      );

      if (instances.length === 0) {
        figma.ui.postMessage({
          type: 'success',
          target: 'detach',
          message: '当前页面没有找到任何实例对象'
        });
        return;
      }

      let detachedCount = 0;
      // 从最深层开始分离，避免父级先分离导致子级丢失引用
      const sorted = instances.sort((a, b) => {
        // 计算节点深度
        let depthA = 0, depthB = 0;
        let p = a.parent;
        while (p) { depthA++; p = p.parent; }
        p = b.parent;
        while (p) { depthB++; p = p.parent; }
        return depthB - depthA; // 深度大的排前面
      });

      for (const instance of sorted) {
        try {
          // 检查节点是否还在文档中（可能已被父级分离影响）
          if (instance.parent) {
            instance.detachInstance();
            detachedCount++;
          }
        } catch (e) {
          console.error(`分离实例失败: ${e.message}`);
        }
      }

      const resultMsg = `完成！已分离 ${detachedCount} 个实例（共找到 ${instances.length} 个）`;
      figma.ui.postMessage({
        type: 'success',
        target: 'detach',
        message: resultMsg
      });
      figma.notify(resultMsg);

    } catch (e) {
      figma.ui.postMessage({
        type: 'error',
        target: 'detach',
        message: `分离实例出错: ${e.message}`
      });
    }
    return;
  }

  // 批量替换素材
  if (msg.type === 'replace') {
    const sourceName = msg.sourceName;
    const targetName = msg.targetName;

    try {
      // 查找源素材节点（取第一个匹配的）
      const sourceNode = figma.currentPage.findOne(
        (node) => node.name === sourceName
      );

      if (!sourceNode) {
        figma.ui.postMessage({
          type: 'error',
          message: `找不到源素材 "${sourceName}"，请检查图层名称是否正确`
        });
        return;
      }

      // 查找所有要被替换的目标节点
      const targetNodes = figma.currentPage.findAll(
        (node) => node.name === targetName
      );

      if (targetNodes.length === 0) {
        figma.ui.postMessage({
          type: 'error',
          message: `找不到目标素材 "${targetName}"，请检查图层名称是否正确`
        });
        return;
      }

      let replacedCount = 0;
      let errorCount = 0;

      for (const target of targetNodes) {
        try {
          const parent = target.parent;
          if (!parent) continue;

          // 保存目标节点的位置和尺寸
          const savedX = target.x;
          const savedY = target.y;
          const savedWidth = target.width;
          const savedHeight = target.height;

          // 保存视觉属性
          const savedOpacity = target.opacity !== undefined ? target.opacity : 1;
          const savedVisible = target.visible !== undefined ? target.visible : true;
          const savedLocked = target.locked !== undefined ? target.locked : false;
          const savedBlendMode = target.blendMode || 'NORMAL';

          // 获取目标节点在父级中的索引位置
          const index = parent.children.indexOf(target);

          // 克隆源素材，并立即插入到目标的父容器中（避免残留在页面根层级）
          const clone = sourceNode.clone();
          if (index >= 0) {
            parent.insertChild(index, clone);
          } else {
            parent.appendChild(clone);
          }

          // 删除原目标节点（先插入再删除，保证层级位置正确）
          target.remove();

          // 恢复尺寸
          if ('resize' in clone && typeof clone.resize === 'function') {
            try {
              clone.resize(savedWidth, savedHeight);
            } catch (e) {
              console.log('resize 不支持，尝试缩放');
            }
          }

          // 恢复位置
          clone.x = savedX;
          clone.y = savedY;

          // 恢复视觉属性
          clone.opacity = savedOpacity;
          clone.visible = savedVisible;
          clone.locked = savedLocked;

          if ('blendMode' in clone) {
            clone.blendMode = savedBlendMode;
          }

          // 恢复旋转角度
          if ('rotation' in target && 'rotation' in clone) {
            clone.rotation = target.rotation;
          }

          // 恢复蒙版属性
          if ('isMask' in target && 'isMask' in clone) {
            clone.isMask = target.isMask;
          }

          // 恢复约束
          if ('constraints' in target && 'constraints' in clone) {
            try {
              clone.constraints = {
                horizontal: target.constraints.horizontal,
                vertical: target.constraints.vertical
              };
            } catch (e) { /* 忽略 */ }
          }

          // 恢复效果（阴影、模糊等）
          if ('effects' in target && 'effects' in clone) {
            try {
              clone.effects = JSON.parse(JSON.stringify(target.effects));
            } catch (e) { /* 忽略 */ }
          }

          // 恢复导出设置
          if ('exportSettings' in target && 'exportSettings' in clone) {
            try {
              clone.exportSettings = JSON.parse(JSON.stringify(target.exportSettings));
            } catch (e) { /* 忽略 */ }
          }

          replacedCount++;
        } catch (e) {
          errorCount++;
          console.error(`替换节点失败: ${e.message}`);
        }
      }

      const resultMsg = errorCount > 0
        ? `完成！替换了 ${replacedCount} 个素材，${errorCount} 个失败`
        : `完成！已替换 ${replacedCount} 个素材`;

      figma.ui.postMessage({
        type: errorCount > 0 ? 'error' : 'success',
        message: resultMsg
      });

      figma.notify(resultMsg);

    } catch (e) {
      figma.ui.postMessage({
        type: 'error',
        message: `插件运行出错: ${e.message}`
      });
    }
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};
