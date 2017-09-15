import React, {Component} from 'react';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import {hslToRgb, colorPicker} from './common';
import PropTypes from 'prop-types';

class ColorRing extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			radius: 180, x: 160, y: 0, isMove: false, rotate: 0,
			color: {
				h: 0,
				s: 1,
				l: 0.5,
				a: 1,
			},
			image: require('./ring.png'),
			arrow: <polygon points="25 50 0 0 50 0 25 50"/>
		}
	}

	componentWillMount() {
		const {radius, offset = 20, image, arrow} = this.props;
		const {state} = this;
		this.setState({radius: radius || state.radius, x: (radius || state.radius) - offset, image: image || state.image, arrow: arrow || state.arrow});
	}

	componentDidMount() {
		document.body.addEventListener('mouseup', () => {
			this.setState({isMove: false});
		});
	}

	render() {
		const {radius, isMove, rotate, x, y, color, image, arrow} = this.state;
		const style = {
			height: radius * 2,
			width: radius * 2
		};
		const {className = '', changeBackground, adjustAngle = 0} = this.props;
		const rgb = hslToRgb(color);
		return (
			<div className={className} style={changeBackground && {backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}}>
				<ReactSVGPanZoom width={style.width} height={style.height}
				                 toolbarPosition="none" tool={'none'} detectAutoPan={false} miniaturePosition="none"
				                 detectWheel={false}
				                 SVGBackground={changeBackground && colorPicker(rgb)}
				                 onTouchEnd={() => this.setState({isMove: false})}
				                 onTouchMove={e => {
					                 if (isMove) {
						                 e.preventDefault();
						                 e.stopPropagation();
						                 const R = Math.sqrt((radius - e.changedPoints[0].x) * (radius - e.changedPoints[0].x) + (radius - e.changedPoints[0].y) * (radius - e.changedPoints[0].y));
						                 let cx = (radius - e.changedPoints[0].x) * radius / R;
						                 let cy = (radius - e.changedPoints[0].y) * radius / R;
						                 if (isNaN(cx) || isNaN(cy)) return;
						                 let a = Math.asin((radius - e.changedPoints[0].y) / R) * 180 / Math.PI;
						                 if (isNaN(a)) a = rotate;
						                 a = 90 - a;
						                 a = (e.changedPoints[0].x - radius) < 0 ? 360 - a : a;
						                 this.setState({rotate: (a + adjustAngle) % 360, x: radius - cx, y: radius - cy, color: {...color, h: (a % 360)}}, () => {
						                 	if(this.props.onChange) {
						                 		this.props.onChange(colorPicker(rgb));
						                  }
						                 });
					                 }
				                 }}
				                 onMouseMove={e => {
					                 if (isMove) {
						                 e.preventDefault();
						                 const R = Math.sqrt((radius - e.x) * (radius - e.x) + (radius - e.y) * (radius - e.y));
						                 const cx = (radius - e.x) * radius / R;
						                 const cy = (radius - e.y) * radius / R;
						                 let a = Math.asin((radius - e.y) / R) * 180 / Math.PI;
						                 if (isNaN(a)) a = rotate;
						                 a = 90 - a;
						                 a = (e.x - radius) < 0 ? 360 - a : a;
						                 this.setState({rotate: (a + adjustAngle) % 360, x: radius - cx, y: radius - cy, color: {...color, h: (a % 360)}}, () => {
							                 if(this.props.onChange) {
								                 this.props.onChange(colorPicker(rgb));
							                 }
						                 });
					                 }
				                 }}
				>
					<svg width={style.width} height={style.height}>
						<image xlinkHref={image} width={style.width} height={style.height}/>
						<g fill={'#c9c9c9'} transform={`translate(${x}, ${y}) rotate(${rotate} 0 0) scale(${1})`}
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
}

ColorRing.propTypes = {
	radius: PropTypes.number,
	offSet: PropTypes.number,
	image:PropTypes.object,
	arrow: PropTypes.object,
	onChange: PropTypes.func,
	className: PropTypes.string,
	changeBackground: PropTypes.bool,
	adjustAngle: PropTypes.number
};

export default ColorRing;
