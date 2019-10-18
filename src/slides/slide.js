import { fromEvent } from 'rxjs';

export class Slide {
  element = null;
  steps = [];
  stepsProgress = 0;

  isAnimated = false;
  isActivated = false;

  activeClass;
  stepSelector;
  classSelector;
  orderSelector;
  initialOrderSelector;
  orderCoefficient;

  get hasProgressCompleted() {
    return this.stepsProgress >= this.steps.length;
  }

  constructor(element, {
    activeClass = 'active',
    stepSelector = '.js-slide-step',
    classSelector = 'data-step-class',
    orderSelector = 'data-step-order',
    initialOrderSelector = 'data-step-initial-order',
    orderCoefficient = 10,
  } = {}) {
    this.element = element;
    this.activeClass = activeClass;
    this.stepSelector = stepSelector;
    this.classSelector = classSelector;
    this.orderSelector = orderSelector;
    this.initialOrderSelector = initialOrderSelector;
    this.orderCoefficient = orderCoefficient;

    this.setSteps(this.stepSelector);
    this.initActivation();
  }

  setSteps(stepSelector) {
    this.steps = [...this.element.querySelectorAll(stepSelector)]
      .map((step, i, steps) => {
        step.setAttribute(this.initialOrderSelector, i + steps.length * this.orderCoefficient);
        return step;
      })
      .sort(this.compareOrder.bind(this));

    this.deactivateAllSteps();
  }

  initActivation() {
    fromEvent(this.element, 'transitionend')
      .subscribe(() => this.animationFinished());
  }

  animationFinished() {
    this.isAnimated = false;
  }

  animationStarted() {
    this.isAnimated = true;
  }

  forward() {
    if (!this.isActivated) {
      this.activate();
      return true;
    }

    if (!this.hasProgressCompleted) {
      this.increaseStepsProgress();
      return true;
    }

    return false;
  }

  backward() {
    this.deactivate();
  }

  activate() {
    this.element.classList.add(this.activeClass);
    this.isActivated = true;
    this.animationStarted();
  }

  deactivate() {
    this.element.classList.remove(this.activeClass);
    this.isActivated = false;
    this.animationStarted();
  }

  increaseStepsProgress() {
    this.activateStep(this.steps[this.stepsProgress]);
    this.stepsProgress++;
  }

  activateAllSteps() {
    this.steps.forEach(step => this.activateStep(step))
  }

  deactivateAllSteps() {
    this.steps.forEach(step => this.deactivateStep(step))
  }

  activateStep(step) {
    if (step.hasAttribute(this.classSelector)) {
      step.classList.add(this.getClass(step))
    } else {
      step.style.transition = 'opacity .3s ease'
      step.style.opacity = 1;
      this.animationStarted();
    }
  }

  deactivateStep(step) {
    if (step.hasAttribute(this.classSelector)) {
      step.classList.remove(this.getClass(step))
    } else {
      step.style.transition = null;
      step.style.opacity = 0;
    }
  }

  compareOrder(el1, el2) {
    return this.getOrder(el1) - this.getOrder(el2);
  }

  getOrder(element) {
    const order = parseInt(element.getAttribute(this.orderSelector));
    return isNaN(order)
      ? parseInt(element.getAttribute(this.initialOrderSelector))
      : order;
  }

  getClass(element) {
    return element.getAttribute(this.classSelector) || '';
  }
}
