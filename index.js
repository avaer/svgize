class ColorPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function imageDataToSvg(imageData, opts) {
  const {width, height} = imageData;
  const style = (opts && opts.style) ? opts.style : '';

  let result = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''} viewBox="0 0 ${width} ${height}" ${style ? `style="${style}"` : ''} shape-rendering="crispEdges">`;

  const colorHistories = {};
  const {data: imageDataData} = imageData;
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const baseIndex = (x + (y * imageData.width)) * 4;
      const r = imageDataData[baseIndex + 0];
      const g = imageDataData[baseIndex + 1];
      const b = imageDataData[baseIndex + 2];
      const a = imageDataData[baseIndex + 3];
      const colorString = `rgba(${r},${g},${b},${a})`;

      let entry = colorHistories[colorString];
      if (!entry) {
        entry = [];
        colorHistories[colorString] = entry;
      }

      const colorPoint = new ColorPoint(x, y);
      entry.push(colorPoint);
    }
  }
  for (const colorString in colorHistories) {
    const colorPoints = colorHistories[colorString];

    result += `<path fill="${colorString}" d="`;

    for (let i = 0; i < colorPoints.length; i++) {
      const colorPoint = colorPoints[i];
      const {x, y} = colorPoint;
      if (i > 0) {
        result += ' ';
      }
      result += `M${x},${y} h1 v1 h-1 z`;
    }

    result += `"></path>`;
  }

  result += '</svg>';

  return result;
}

module.exports = {
  imageDataToSvg,
};
