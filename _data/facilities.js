const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// YAMLファイルのパス
const facilitiesYamlPath = path.join(__dirname, 'facilities.yaml');

module.exports = function() {
  try {
    // YAMLファイルを読み込む
    const fileContents = fs.readFileSync(facilitiesYamlPath, 'utf8');
    const data = yaml.load(fileContents);
    
    // アメニティとルームデータを返す
    return {
      amenities: data.amenities || [],
      rooms: data.rooms || []
    };
  } catch (err) {
    console.error('Error loading facilities data:', err);
    return {
      amenities: [],
      rooms: []
    };
  }
};
