export default class BaseComponent {
  constructor($el, props = {}) {
    this.target = $el;
    this.element = $el;
    this.props = props;
    this.state = {};
    this.initialState();
  }

  initialState() {
    this.render();
  }

  setState(nextState) {
    const prevState = { ...this.state };
    const prevProps = { ...this.props };
    this.state = { ...this.state, ...nextState };

    this.reRender();
    this.componentDidUpdate(prevProps, prevState, this.state);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  template() {
    return ``;
  }

  // DOM만 업데이트, 사이드이펙트 없음
  reRender() {
    this.target.innerHTML = this.template();
  }

  // 초기 렌더링 + componentDidMount 호출
  render() {
    this.element = this.target;
    this.target.innerHTML = this.template();

    this.componentDidMount();
  }
}
