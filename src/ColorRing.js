import React, {Component} from 'react';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import {hslToRgb, colorPicker, rgbToHsl} from './common';
import PropTypes from 'prop-types';

class ColorRing extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			radius: 180, x: 160, y: 0, isMove: false, rotate: 0,
			color: {
				h: 0,
				s: 1,
				l: 0.5
			},
			image: require('./ring.png'),
			arrow: null,
			scale: 1
		};
		this.getPointer = this.getPointer.bind(this);
	}

	componentWillMount() {
		const {radius, offset = 20, image, arrow, scale} = this.props;
		const {state} = this;
		this.setState({
			radius: radius || state.radius,
			x: (radius || state.radius) - offset,
			image: image || state.image,
			arrow: arrow || <polygon points="25 50 0 0 50 0 25 50"/>,
			scale: scale || state.scale
		});
	}

	componentDidMount() {
		document.body.addEventListener('mouseup', () => {
			this.setState({isMove: false});
		});
	}

	render() {
		const {radius, isMove, rotate, x, y, color, image, arrow, scale} = this.state;
		const style = {
			height: radius * 2,
			width: radius * 2
		};
		const {className = '', changeBackground, adjustAngle = 6} = this.props;
		const rgb = hslToRgb(color);
		return (
			<div className={className} style={changeBackground && {backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}}>
				<ReactSVGPanZoom width={style.width} height={style.height}
				                 toolbarPosition="none" tool={'none'} detectPinchGesture={false} detectAutoPan={false}
				                 miniaturePosition="none"
				                 detectWheel={false}
				                 SVGBackground={changeBackground && colorPicker(rgb)}
				                 onTouchEnd={() => this.setState({isMove: false})}
				                 onTouchMove={e => {
					                 if (isMove) {
						                 e.preventDefault();
						                 e.stopPropagation();
						                 const {cx, cy, a} = this.getPointer(radius, e.changedPoints[0].x, e.changedPoints[0].y, rotate);
						                 this.setState({
							                 rotate: (a + adjustAngle) % 360,
							                 x: radius - cx,
							                 y: radius - cy,
							                 color: {...color, h: (a % 360)}
						                 }, () => {
							                 if (this.props.onChange) {
								                 this.props.onChange({htmlColor: colorPicker(rgb), rgb, hsl: color});
							                 }
						                 });
					                 }
				                 }}
				                 onMouseMove={e => {
					                 if (isMove) {
						                 e.preventDefault();
						                 const {cx, cy, a} = this.getPointer(radius, e.x, e.y, rotate);
						                 this.setState({
							                 rotate: (a + adjustAngle) % 360,
							                 x: radius - cx,
							                 y: radius - cy,
							                 color: {...color, h: (a % 360)}
						                 }, () => {
							                 if (this.props.onChange) {
								                 this.props.onChange({htmlColor: colorPicker(rgb), rgb, hsl: color});
							                 }
						                 });
					                 }
				                 }}
				>
					<svg width={style.width} height={style.height}>
						<image xlinkHref={image} width={style.width} height={style.height}/>
						<g fill={'#c9c9c9'} transform={`translate(${x}, ${y}) rotate(${rotate} 0 0) scale(${scale})`}
						   onTouchStart={e => {
							   e.preventDefault();
							   e.stopPropagation();
							   this.setState({isMove: true})
						   }}
						   onMouseDown={() => this.setState({isMove: true})}>
							{arrow}
						</g>
					</svg>
				</ReactSVGPanZoom>
			</div>
		);
	}

	getPointer(radius, x, y, rotate) {
		const R = Math.sqrt((radius - x) * (radius - x) + (radius - y) * (radius - y));
		const cx = (radius - x) * radius / R;
		const cy = (radius - y) * radius / R;
		let a = Math.asin((radius - y) / R) * 180 / Math.PI;
		if (isNaN(a)) a = rotate;
		a = 90 - a;
		a = (x - radius) < 0 ? 360 - a : a;
		return {cx, cy, a};
	}
}

ColorRing.propTypes = {
	radius: PropTypes.number,
	offSet: PropTypes.number,
	image: PropTypes.object,
	arrow: PropTypes.object,
	onChange: PropTypes.func,
	className: PropTypes.string,
	changeBackground: PropTypes.bool,
	adjustAngle: PropTypes.number,
	scale: PropTypes.number
};

ColorRing.hslToRgb = hslToRgb;
ColorRing.rgbToHsl = rgbToHsl;
ColorRing.colorPicker = colorPicker;

export default ColorRing;
