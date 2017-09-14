import React from 'react';

class Arrow extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {isMove: false, clientX: 0, clientY: 0}
	}

	componentDidMount() {
		document.body.addEventListener('mousemove', e => {
			if (this.state.isMove) {
				const pos = widgetCoords(e, this.state.radius);
				this.setState({clientX: pos.x, clientY: pos.y});
			}
		});
		document.body.addEventListener('mouseup', () => {
			this.setState({isMove: false});
		});
	}

	render() {
		const {rotate = 0, scale = 0.6, radius} = this.props;
		const x = radius - 25;
		const y = 2;
		return <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
			<polygon fill={'#c9c9c9'} points="25 50 0 0 50 0 25 50"
			         transform={`translate(${x}, ${y}) rotate(${rotate} ${radius} ${radius}) scale(${scale})`}
			         onMouseDown={() => this.setState({isMove: true})}/>
		</svg>
	}
}

const widgetCoords = (event, radius) => {
	let x, y;
	let el = event.target || event.srcElement;
	const reference = document.getElementById('ring');
	let pos = {x: event.offsetX, y: event.offsetY};
	if (typeof event.offsetX !== 'undefined') {
		// Use offset coordinates and find common offsetParent

		// Send the coordinates upwards through the offsetParent chain.
		// let e = el;
		// while (e) {
		// 	e.mouseX = pos.x;
		// 	e.mouseY = pos.y;
		// 	pos.x += e.offsetLeft;
		// 	pos.y += e.offsetTop;
		// 	e = e.offsetParent;
		// }

		// Look for the coordinates starting from the wheel widget.
		let e = reference;
		let offset = {x: 0, y: 0};
		while (e) {
			if (typeof e.mouseX !== 'undefined') {
				x = e.mouseX - offset.x;
				y = e.mouseY - offset.y;
				break;
			}
			offset.x += e.offsetLeft;
			offset.y += e.offsetTop;
			e = e.offsetParent;
		}

		// Reset stored coordinates
		e = el;
		while (e) {
			e.mouseX = undefined;
			e.mouseY = undefined;
			e = e.offsetParent;
		}
	} else {
		// Use absolute coordinates
		pos = absolutePosition(reference);
		x = (event.pageX || 0 * (event.clientX + document.body.scrollLeft)) - pos.x;
		y = (event.pageY || 0 * (event.clientY + document.body.scrollTop)) - pos.y;
	}
	// Subtract distance to middle
	return {x: x - radius / 2, y: y - radius / 2};
};

const absolutePosition = (el) => {
	let r = {x: el.offsetLeft, y: el.offsetTop};
	// Resolve relative to offsetParent
	if (el.offsetParent) {
		const tmp = absolutePosition(el.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
};

export default Arrow;