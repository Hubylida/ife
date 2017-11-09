import * as throttle from 'lodash/throttle.js';

interface IInfiniteScrollOptions {
	/**
	 * 具体可视区域高度
	 *
	 * @type {number}
	 * @memberOf IInfiniteScrollOptions
	 */
	threshold?: number;
	/**
	 * 渲染元素函数
	 *
	 * @param {InfiniteScroll} this
	 * @param {HTMLElement} li li元素
	 * @param {any} data 对应的数据
	 *
	 * @memberOf IInfiniteScrollOptions
	 */
	render?(this: InfiniteScroll, li: HTMLElement, data): void;
	/**
	 * 触发后的回调(会默认在触发后禁用监听)
	 *
	 * @param {InfiniteScroll} this
	 * @param {Function} able 重新监听滚动
	 *
	 * @memberOf IInfiniteScrollOptions
	 */
	trigger?(this: InfiniteScroll, able: Function): void;
}

export class InfiniteScroll {
	private _options: IInfiniteScrollOptions;
	private _container: HTMLElement;
	private _data: any[];
	private _liList: HTMLElement[];
	private _scrolled: boolean;

	constructor(container: HTMLElement, options?: IInfiniteScrollOptions) {
		const _options: IInfiniteScrollOptions = {
			threshold: 200,
			render: (li, data) => {
				const text = document.createTextNode(data);
				li.appendChild(text);
				this._container.appendChild(li);
			}
		};

		Object.assign(_options, options);

		this._options = _options;
		this._container = container;
		this._data = [];
		this._liList = [];
		this._scrolled = false;

		this.init();
	}

	private init() {
		window.addEventListener('scroll', this.handleScroll);
	}

	private handleScroll = throttle((e) => {
		if (this._scrolled) {
			return;
		}

		const op = this._options;

		if (document.body.offsetHeight < window.scrollY + window.innerHeight + op.threshold) {
			if (op.trigger) {
				const able = () => {
					this._scrolled = false;
				};
				this._scrolled = true;
				op.trigger.call(this, able);
			}
		}
	}, 150);

	private create(data) {
		const li = document.createElement('li');
		this._liList.push(li);
		this._options.render.call(this, li, data);
	}

	public add(data: any[]) {
		this._data.push(...data);
		data.forEach(v => {
			this.create(v);
		});
	}

	public destroy() {
		window.removeEventListener('scroll', this.handleScroll);
	}
}
