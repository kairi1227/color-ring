import React, {Component} from 'react';
import './App.css';
// import Arrow from './arrow';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';

class App extends Component {
	constructor() {
		super(...arguments);
		this.state = {radius: 200, x: 180, y: 0, isMove: false, rotate: 0}
	}

	componentWillMount() {
		const {radius} = this.props;
		this.setState({radius: radius || this.state.radius});
	}

	componentDidMount() {
		document.body.addEventListener('mouseup', () => {
			this.setState({isMove: false});
		});
	}

	render() {
		const {radius, isMove, rotate, x, y} = this.state;
		const style = {
			height: radius * 2,
			width: radius * 2
		};
		// console.log(x, y, isMove)
		return (
			<div className="color-ring" id={'ring'}>
				<ReactSVGPanZoom width={style.width} height={style.height}
				                 toolbarPosition="none" tool={'none'} detectAutoPan={false} miniaturePosition="none"
				                 ref={ref => this.svgView = ref}
				                 detectWheel={false}
				                 onTouchEnd={() => this.setState({isMove: false})}
				                 onTouchMove={e => {
					                 if (isMove) {
						                 e.preventDefault();
						                 e.stopPropagation();
						                 const R = Math.sqrt((radius - e.changedPoints[0].x) * (radius - e.changedPoints[0].x) + (radius - e.changedPoints[0].y) * (radius - e.changedPoints[0].y));
						                 let cx = (radius - e.changedPoints[0].x) * radius / R;
						                 let cy = (radius - e.changedPoints[0].y) * radius / R;
						                 if(isNaN(cx) || isNaN(cy)) return;
						                 let a = Math.asin((radius - e.changedPoints[0].y) / R) * 180 / Math.PI;
						                 if (isNaN(a)) a = rotate;
						                 a = 90 - a;
						                 a = (e.changedPoints[0].x  - radius) < 0 ? 360 - a : a;
						                 this.setState({rotate: (a + 6), x: radius - cx, y: radius - cy});
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
						                 a = (e.x  - radius) < 0 ? 360 - a : a;
						                 this.setState({rotate: a, x: radius - cx, y: radius - cy});
					                 }
				                 }}
				>
					<svg width={style.width} height={style.height}>
						<image xlinkHref={require('./ring.png')} width={style.width} height={style.height}/>
						<polygon fill={'#c9c9c9'} points="25 50 0 0 50 0 25 50"
						         transform={`translate(${x}, ${y}) rotate(${rotate} 0 0) scale(${0.8})`}
						         onTouchStart={e => {
							         e.preventDefault();
							         e.stopPropagation();
							         this.setState({isMove: true})
						         }}
						         onMouseDown={() => this.setState({isMove: true})}/>
					</svg>
				</ReactSVGPanZoom>
			</div>
		);
	}
}

export default App;
