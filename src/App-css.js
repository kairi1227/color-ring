import React, { Component } from 'react';
import './App.css';
// import Arrow from './arrow';

class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {radius: 400, x: 0, y: 0, isMove: false}
  }

  componentWillMount() {
    const {radius} = this.props;
    this.setState({radius: radius || this.state.radius});
  }

	componentDidMount() {
		document.body.addEventListener('mousemove', e => {
			if (this.state.isMove) {
				const pos = widgetCoords(e, this.state.radius);
				let hue = Math.atan2(pos.x, - pos.y) / 6.28;
				if (hue < 0) hue += 1;
				const angle = hue * 6.28;
				this.setState({left: Math.round(Math.sin(angle) * this.state.radius + this.state.radius), top: Math.round(-Math.cos(angle) * this.state.radius + this.state.radius)});
			}
		});
		document.body.addEventListener('mouseup', () => {
			this.setState({isMove: false});
		});
	}
  render() {
	  const {radius, left, top} = this.state;
    const style = {
      height: radius * 2,
      width: radius * 2,
      backgroundSize: `${radius * 2}px`,
    };

    return (
      <div className="color-ring" id={'ring'}>
        <div className={'ring-bg'} style={style}>
          {/*<Arrow rotate={0} radius={radius} />*/}
          <div className={'ring-arrow'} id={'arrow'} style={{left, top}} onMouseDown={() => this.setState({isMove: true})}/>
        </div>
      </div>
    );
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
		let e = el;
		while (e) {
			e.mouseX = pos.x;
			e.mouseY = pos.y;
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
			e = e.offsetParent;
		}

		// Look for the coordinates starting from the wheel widget.
		e = reference;
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

export default App;
