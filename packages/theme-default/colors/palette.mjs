/** DSM 初始色轮的色相、饱和度与明度锚点；不作为默认主题 CSS 的来源。 */
const wheelAnchors = {
  red: '#f93920',
  pink: '#e91e63',
  purple: '#9c27b0',
  violet: '#6a3ac7',
  indigo: '#3f51b5',
  blue: '#0077fa',
  'light-blue': '#0095ee',
  cyan: '#05a4b6',
  teal: '#00a696',
  green: '#38aa43',
  'light-green': '#7bb63c',
  lime: '#9bd100',
  yellow: '#fac800',
  amber: '#f0b114',
  orange: '#fc8800',
};
/** 内部梯度位置；50 对应公开第 0 级，500 对应浅色的品牌锚点。 */
const scalePositions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/** 仅解析公开承诺的不透明 HEX，内部始终使用整数 RGB 通道。 */
function parseHex(value) {
  if (typeof value !== 'string' || !/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(value)) {
    throw new TypeError('颜色必须为 #RGB 或 #RRGGBB 格式');
  }
  return hexToRgb(value);
}

/** 解码已校验或由内部生成的 HEX，不重复执行公开输入格式校验。 */
function hexToRgb(value) {
  /** 短 HEX 按通道展开，避免浏览器参与颜色解析。 */
  const digits =
    value.length === 4
      ? value.slice(1).replace(/./g, /** 展开一位 HEX 通道。 */ (digit) => digit + digit)
      : value.slice(1);
  /** 连续三个字节分别为红、绿、蓝，保持输入通道整数精度。 */
  const packed = Number.parseInt(digits, 16);
  return [packed >> 16, (packed >> 8) & 255, packed & 255];
}

/** 校验模式边界；省略时只生成浅色，不访问系统主题。 */
function readMode(options) {
  /** 模式是调用方唯一可配置的算法参数。 */
  const mode = options?.mode === undefined ? 'light' : options.mode;
  if (mode !== 'light' && mode !== 'dark') throw new TypeError('mode 必须为 light 或 dark');
  return mode;
}

/** 将量值裁剪到闭区间；仅用于算法明确要求的饱和度及明度限制。 */
function clamp(value, lower = 0, upper = 1) {
  return Math.min(Math.max(value, lower), upper);
}

/** 归一化循环位置，同时用于色相角度与色轮相邻索引。 */
function wrap(value, period) {
  return ((value % period) + period) % period;
}

/** 将 RGB 转成 HSV；无色相颜色保留 NaN，以维持灰阶分支的计算语义。 */
function toHsv([red, green, blue]) {
  /** 最大与最小通道之差决定饱和度，最大通道决定明度。 */
  const max = Math.max(red, green, blue);
  /** 最小通道不影响明度，只参与色度差。 */
  const delta = max - Math.min(red, green, blue);
  let hue = Number.NaN;
  if (delta !== 0) {
    if (red === max) hue = (green - blue) / delta;
    if (green === max) hue = 2 + (blue - red) / delta;
    if (blue === max) hue = 4 + (red - green) / delta;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  return [hue, max === 0 ? 0 : delta / max, max / 255];
}

/** 以整数通道生成规范 HEX；取整发生于序列化处，不提前改变 HSV 精度。 */
function rgbToHex(channels) {
  return (
    '#' +
    channels
      .map(
        /** 将一个 RGB 通道写成两位小写 HEX。 */ (channel) =>
          Math.round(clamp(channel, 0, 255))
            .toString(16)
            .padStart(2, '0'),
      )
      .join('')
  );
}

/** HSV 的六个扇区分别指定 RGB 通道；运算顺序保留通道取整的一致性。 */
function hsvToHex(hue, saturation, value) {
  /** HSV 的 V 是相对值；RGB 计算使用 0…255 范围。 */
  const maximum = value * 255;
  if (saturation === 0) return rgbToHex([maximum, maximum, maximum]);
  /** 色相归一化后分成六个 60° 的扇区。 */
  const sector = wrap(hue, 360) / 60;
  /** 小数部分决定两个相邻主色之间的插值。 */
  const fraction = sector - Math.floor(sector);
  /** 最小通道及两个互补插值通道。 */
  const minimum = maximum * (1 - saturation);
  /** 扇区开始时由最大通道递减的中间值。 */
  const descending = maximum * (1 - saturation * fraction);
  /** 扇区开始时由最小通道递增的中间值。 */
  const ascending = maximum * (1 - saturation * (1 - fraction));
  /** 各扇区只是同一组通道的排列，不改变颜色计算参数。 */
  const sectors = [
    [maximum, ascending, minimum],
    [descending, maximum, minimum],
    [minimum, maximum, ascending],
    [minimum, descending, maximum],
    [ascending, minimum, maximum],
    [maximum, minimum, descending],
  ];
  return rgbToHex(sectors[Math.floor(sector)]);
}

/** 将一个已校验的 RGB 生成十级梯度；暗色先校准并量化，再计算与反转。 */
function createScale(rgb, mode) {
  let [hue, saturation, value] = toHsv(rgb);
  if (mode === 'dark') {
    // 深色校准需要 HEX 往返；省略这次量化会产生一个通道的结果偏差。
    // 固定规则：饱和度降为 92%，明度增加 0.01，并限制在有效范围内。
    [hue, saturation, value] = toHsv(
      hexToRgb(hsvToHex(hue, saturation * 0.92, Math.min(value + 0.01, 1))),
    );
  }
  /** 第 5 级是浅色锚点；其余位置按冷暖与相对亮度分段延伸。 */
  const result = scalePositions.map(
    /** 计算一个梯度位置的 HSV 变化量。 */ (position) => {
      /** 色相偏移的内部位置差，与 S/V 的百位级差分开计算。 */
      const distance = position - 500;
      /** 饱和度和明度每级按 100 个内部位置单位变化。 */
      const step = distance / 100;
      let hueRate;
      // 20/48/80/260° 划分冷暖偏移段；0.01/0.02/0.03 是每内部单位的度数。
      if (position <= 500) hueRate = hue > 80 && hue < 260 ? 0.01 : -0.02;
      else if (hue > 20 && hue < 48) hueRate = -0.03;
      else hueRate = hue >= 48 && hue < 260 ? 0.01 : -0.02;
      let saturationOffset = 0;
      // 浅阶在五级范围内降低饱和度；最浅级额外减 0.02，深阶按 30/200° 分段。
      if (position < 500) {
        saturationOffset = (step * saturation) / 5;
        if (position < 100) saturationOffset -= 0.02;
      } else if (position > 500 && saturation !== 0) {
        saturationOffset = step * (hue < 30 || hue > 200 ? 0.03 : 0.01);
      }
      let valueOffset = 0;
      // 饱和度低于 0.1 时浅阶提亮加速 6%；深阶按亮度 0.8 与色相段选择速率。
      if (position < 500) {
        valueOffset = (step * (1 - value)) / 5;
        if (saturation < 0.1) valueOffset *= 1.06;
      } else if (position > 500) {
        valueOffset =
          (hue < 30 || hue > 200) && hue > 0
            ? step * (value > 0.8 ? 0.14 : 0.08)
            : (step * value) / 6;
      }
      return hsvToHex(
        wrap(hue + distance * hueRate, 360),
        clamp(saturation + saturationOffset),
        clamp(value - valueOffset),
      );
    },
  );
  return mode === 'dark' ? result.reverse() : result;
}

/** 生成一个颜色的十级色阶；灰、黑、白同样支持，输出索引为 Semi 的 0…9。 */
export function generateColorScale(color, options) {
  return createScale(parseHex(color), readMode(options));
}

/** sRGB 通道线性化，使用 D65 CIE Lab 所需的标准传递函数。 */
function linearize(channel) {
  /** 相对通道采用 0…1 范围，0.04045 为 sRGB 的分段阈值。 */
  const normalized = channel / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

/** XYZ 到 Lab 的分段传递函数；小数常量精度与参考色彩模型一致。 */
function labCurve(value) {
  return value > 0.008856452 ? value ** (1 / 3) : value / 0.12841855 + 0.137931034;
}

/** 返回颜色相对标准红色的 CIE76 距离平方，用于色轮起点排序。 */
function redDistance(color) {
  /** Lab 计算只参与排序，不能替代色阶本身使用的 HSV 运算。 */
  const [red, green, blue] = hexToRgb(color).map(
    /** 将通道转为线性光。 */ (channel) => linearize(channel),
  );
  /** D65 标准 sRGB→XYZ 矩阵和白点缩放值。 */
  const x = labCurve((0.4124564 * red + 0.3575761 * green + 0.1804375 * blue) / 0.95047);
  /** Y 使用白点 1，直接参与 L*。 */
  const y = labCurve(0.2126729 * red + 0.7151522 * green + 0.072175 * blue);
  /** Z 使用 D65 白点 1.08883。 */
  const z = labCurve((0.0193339 * red + 0.119192 * green + 0.9503041 * blue) / 1.08883);
  /** 标准红色按相同模型计算，避免以近似常量影响边界排序。 */
  const redX = labCurve(0.4124564 / 0.95047);
  /** 红色的线性 Y 通道。 */
  const redY = labCurve(0.2126729);
  /** 红色的线性 Z 通道。 */
  const redZ = labCurve(0.0193339 / 1.08883);
  return (
    (Math.max(0, 116 * y - 16) - Math.max(0, 116 * redY - 16)) ** 2 +
    (500 * (x - y) - 500 * (redX - redY)) ** 2 +
    (200 * (y - z) - 200 * (redY - redZ)) ** 2
  );
}

/** 由品牌色旋转初始色轮并生成全部色阶；无色相输入不构成有效品牌色轮。 */
export function generateColorPalette(brand, options) {
  /** 输入仅解析一次，后续内部颜色均由算法生成。 */
  const rgb = parseHex(brand);
  /** 无色相会让参考色轮的偏移率退化为 NaN，公开入口明确拒绝。 */
  const [brandHue, brandSaturation, brandValue] = toHsv(rgb);
  if (brandSaturation === 0) throw new RangeError('整盘生成要求品牌色具有非零饱和度');
  /** 模式只影响 S/V 对整盘的偏移及最终暗色校准。 */
  const mode = readMode(options);
  /** 保持初始色轮命名顺序，尤其保留相同距离时的第一个锚点。 */
  const names = Object.keys(wheelAnchors);
  /** 预先解算初始色轮，避免排序过程中改变锚点。 */
  const anchors = names.map(
    /** 读取一个初始命名色的 HSV。 */ (name) => toHsv(hexToRgb(wheelAnchors[name])),
  );
  let closestIndex = 0;
  for (let index = 1; index < anchors.length; index += 1) {
    if (Math.abs(anchors[index][0] - brandHue) < Math.abs(anchors[closestIndex][0] - brandHue))
      closestIndex = index;
  }
  /** 色相偏移选用最近锚点一侧的间隔；末尾两项依参考规则连接初始项。 */
  const intervals = anchors.map(
    /** 计算参考色轮定义的每项旋转间隔。 */ (anchor, index) =>
      wrap(anchor[0] - anchors[index < anchors.length - 2 ? index + 1 : 0][0], 360),
  );
  /** 正向偏移时采用前一侧间隔，负向时采用当前侧间隔。 */
  const intervalIndex =
    brandHue > anchors[closestIndex][0] ? wrap(closestIndex - 1, anchors.length) : closestIndex;
  /** 色轮允许品牌与锚点差异的一半，避免跨越色相定义。 */
  const hueRatio = (brandHue - anchors[closestIndex][0]) / intervals[intervalIndex] / 2;
  /** 暗色轮仅旋转色相，不再按品牌 S/V 同步偏移。 */
  const saturationRatio =
    mode === 'light'
      ? (brandSaturation - anchors[closestIndex][1]) / anchors[closestIndex][1] / 2
      : 0;
  /** 与饱和度相同，亮度偏移仅用于浅色轮。 */
  const valueRatio =
    mode === 'light' ? (brandValue - anchors[closestIndex][2]) / anchors[closestIndex][2] / 2 : 0;
  /** 色轮颜色量化后再按色相排序，不能对未量化的 HSV 排序。 */
  const wheel = anchors
    .map(
      /** 旋转一项；固定下限 S=0.65、V=0.7，保持基础色轮的可用色度。 */ (anchor, index) =>
        hsvToHex(
          wrap(anchor[0] + intervals[index] * hueRatio, 360),
          clamp(anchor[1] * (1 + saturationRatio), 0.65, 1),
          clamp(anchor[2] * (1 + valueRatio), 0.7, 1),
        ),
    )
    .sort(
      /** 将命名色轮按色相降序排列。 */ (left, right) =>
        toHsv(hexToRgb(right))[0] - toHsv(hexToRgb(left))[0],
    );
  if (redDistance(wheel[0]) > redDistance(wheel[wheel.length - 1])) wheel.unshift(wheel.pop());
  /** 插入顺序是公开命名顺序，先基础有色相，再 grey 和 brand。 */
  const palette = {};
  for (let index = 0; index < names.length; index += 1)
    palette[names[index]] = createScale(hexToRgb(wheel[index]), mode);
  // 灰色轴沿用品牌色相，但固定 S=0.09、V=0.46；它不参与有色色轮的排序。
  palette.grey = createScale(hexToRgb(hsvToHex(brandHue, 0.09, 0.46)), mode);
  palette.brand = createScale(rgb, mode);
  return palette;
}
