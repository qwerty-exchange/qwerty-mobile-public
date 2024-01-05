const plugins = require('@expo/config-plugins');

const fs = require('fs');
const path = require('path');

function withAndroidCopyAssets(config) {
  return plugins.withDangerousMod(config, [
    'android',
    async (config) => {
      const filePath = path.join(config.modRequest.projectRoot, 'assets/trades');
      const projectRoot = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/assets/trades'
      );
      fs.cpSync(filePath, projectRoot, { recursive: true });
      return config;
    },
  ]);
}

function withIOSCopyAssets(config) {
  return plugins.withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(config.modRequest.projectRoot, 'assets/trades');
      const projectRoot = path.join(config.modRequest.platformProjectRoot, 'QWERTY/trades');
      fs.cpSync(filePath, projectRoot, { recursive: true });
      return config;
    },
  ]);
}

function withIOSAddFilesToProject(config) {
  return plugins.withXcodeProject(config,
    async (config) => {
      const proj = config.modResults;
      const targetUuid = proj.findPBXGroupKey({ name: 'QWERTY' });

      const file = proj.addFile("QWERTY/trades", targetUuid, { lastKnownFileType: 'folder' });

      file.uuid = proj.generateUuid();
      proj.addToPbxBuildFileSection(file);        // PBXBuildFile
      proj.addToPbxResourcesBuildPhase(file);     // PBXResourcesBuildPhase
      
      return config;
    },
  );
}
module.exports = function withLocalTradeView(config) {
  return plugins.withPlugins(config, [
    withAndroidCopyAssets,
    withIOSCopyAssets, 
    withIOSAddFilesToProject
  ]);
};
