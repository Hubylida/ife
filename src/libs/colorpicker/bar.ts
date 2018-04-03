import { bind, unbind } from '../utils/drag';
import { generateCanvas } from '../utils';
import { HSV } from './utils';

interface Color {
  h: number;
}
export interface ColorBarOptions {
  width: number;
  height: number;
  lineWidth?: number;
  padding?: number;
  onColorChange?({ h: number }): void;
}

export class ColorBar {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _gradient: CanvasGradient;
  private _y: number;
  private _contentWidth: number;
  private _contentHeight: number;
  private _id: number;
  private _color: Color;

  private _options: ColorBarOptions;

  constructor(canvas: HTMLCanvasElement, options: ColorBarOptions) {
    const _options = {
      lineWidth: 1,
      padding: 10
    };

    const r = generateCanvas(canvas, options);

    if (options) {
      Object.assign(_options, options);
    }

    this._options = _options as ColorBarOptions;

    this._canvas = canvas;

    this.init();
  }

  private init() {
    const { padding, width, height } = this._options;

    const canvas = this._canvas,
      ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(
      padding,
      padding,
      padding,
      height - padding * 2
    );

    const length = HSV.length;

    // 填充背景色
    HSV.forEach((color, index) => {
      gradient.addColorStop(index / (length - 1), color);
    });

    this._contentWidth = width - padding * 2;
    this._contentHeight = height - padding * 2;

    this._gradient = gradient;

    this._ctx = ctx;

    ctx.lineWidth = this._options.lineWidth;

    this._id = bind(canvas, e => {
      this.setCoordinate(e.y);
    });

    Promise.resolve().then(() => {
      this.setCoordinate(0);
    });
  }

  // 这里背景色不会改变,可以复用CanvasGradient
  private fillBackground() {
    const gradient = this._gradient,
      ctx = this._ctx;
    const { padding, width, height } = this._options;

    ctx.fillStyle = gradient;
    ctx.fillRect(padding, padding, this._contentWidth, this._contentHeight);
  }

  private setCoordinate(y: number) {
    const { padding, height } = this._options;
    let result;

    if (y < padding) {
      result = padding;
    } else if (y > height - padding) {
      result = height - padding;
    } else {
      result = y;
    }

    if (this._y === result) {
      return;
    }

    this._y = result;

    if (this._options.onColorChange) {
      const k = (result - padding) / this._contentHeight;
      const hue = Math.floor(k * 360);

      const color = { h: hue };

      this._color = color;

      this._options.onColorChange(color);
    }

    this.draw();
  }

  // 渲染光标
  private renderSlider() {
    if (typeof this._y !== 'number') {
      return;
    }

    const { padding, width, height, lineWidth } = this._options;

    const x = width / 2,
      y = this._y,
      sliderWidth = width,
      sliderHeight = padding / 2;

    const ctx = this._ctx;

    ctx.save();

    ctx.strokeStyle = '#000';

    ctx.strokeRect(0, y - sliderHeight / 2, sliderWidth, sliderHeight);

    ctx.strokeStyle = '#fff';

    ctx.strokeRect(
      lineWidth,
      y - sliderHeight / 2 + lineWidth,
      sliderWidth - lineWidth * 2,
      sliderHeight - lineWidth * 2
    );
    ctx.stroke();

    ctx.restore();
  }

  private draw() {
    const { width, height } = this._options;

    this._ctx.clearRect(0, 0, width, height);

    this.fillBackground();

    this.renderSlider();
  }

  public destroy() {
    unbind(this._id);
  }

  set color(color: Color) {
    if (color.h === this._color.h) {
      return;
    }

    const { padding } = this._options;

    const k = color.h / 360;

    const y = this._contentHeight * k + padding;

    this.setCoordinate(y);
  }

  get color() {
    return this._color;
  }
}
