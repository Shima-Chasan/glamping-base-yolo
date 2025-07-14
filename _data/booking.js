const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// YAMLファイルのパス
const bookingYamlPath = path.join(__dirname, 'booking.yaml');

module.exports = function() {
  try {
    // YAMLファイルを読み込む
    const fileContents = fs.readFileSync(bookingYamlPath, 'utf8');
    const data = yaml.load(fileContents);
    
    return data.options || {
      roomTypes: [],
      mealOptions: [],
      activityOptions: []
    };
  } catch (err) {
    console.error('Error loading booking data:', err);
    return {
      roomTypes: [],
      mealOptions: [],
      activityOptions: []
    };
  }
};
