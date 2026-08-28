import React, { useState } from 'react';
import Carousel from '@semi-v2.102.0/carousel';

const slideLabels = ['设计', '开发', '交付'];

export function CarouselScenario(): React.ReactElement {
  const [status, setStatus] = useState('当前：设计');
  return (
    <div className="carousel-scenario" data-testid="carousel-reference">
      <Carousel
        autoPlay={false}
        theme="dark"
        speed={0}
        className="carousel-scenario__hero"
        data-parity-target="carousel-basic"
        aria-label="产品流程轮播"
        onChange={(index) => setStatus(`当前：${slideLabels[index]}`)}
      >
        <section className="carousel-scenario__slide carousel-scenario__slide--blue">
          <strong>设计</strong>
          <span>统一视觉语言</span>
        </section>
        <section className="carousel-scenario__slide carousel-scenario__slide--violet">
          <strong>开发</strong>
          <span>沉淀组件能力</span>
        </section>
        <section className="carousel-scenario__slide carousel-scenario__slide--green">
          <strong>交付</strong>
          <span>保持体验一致</span>
        </section>
      </Carousel>

      <div className="carousel-scenario__variants">
        <Carousel
          autoPlay={false}
          animation="fade"
          indicatorType="line"
          indicatorPosition="left"
          theme="primary"
          showArrow={false}
          className="carousel-scenario__compact"
          data-parity-target="carousel-fade"
        >
          <div className="carousel-scenario__mini carousel-scenario__mini--warm">Fade A</div>
          <div className="carousel-scenario__mini carousel-scenario__mini--cool">Fade B</div>
        </Carousel>

        <Carousel
          autoPlay={false}
          indicatorType="columnar"
          indicatorSize="medium"
          indicatorPosition="right"
          arrowType="hover"
          slideDirection="right"
          theme="light"
          className="carousel-scenario__compact"
          data-parity-target="carousel-columnar"
        >
          <div className="carousel-scenario__mini carousel-scenario__mini--dark">Column 1</div>
          <div className="carousel-scenario__mini carousel-scenario__mini--ink">Column 2</div>
        </Carousel>

        <Carousel
          autoPlay={false}
          className="carousel-scenario__single"
          data-parity-target="carousel-single"
        >
          <div className="carousel-scenario__mini carousel-scenario__mini--single">单项无控件</div>
        </Carousel>
      </div>

      <output className="carousel-scenario__status" aria-live="polite">
        {status}
      </output>
    </div>
  );
}
