import { canvas, ctx } from "./canvas.js";

import { useCases, UseCase } from "./usecase.js";

function init() {
  const login = new UseCase("login");
  const signup = new UseCase("signup");
  const abc = new UseCase("abcghijkl");
  const def = new UseCase("defghklmnopqr");
  login.setIncludes(abc, def);
}

function update() {
  for (const useCase1 of useCases) {
    for (const useCase2 of useCase1.includes) {
      const posDelta = useCase2.pos.sub(useCase1.pos);
      const deltaMag = posDelta.mag();
      if (useCase1.doesInclude(useCase2)) {
        const minAcceptableDistance =
          useCase1.dimensions.radius +
          useCase2.dimensions.radius +
          UseCase.PADDING;

        const maxAcceptableDistance =
          minAcceptableDistance + UseCase.PADDING_THRESHOLD;

        const velocity = posDelta.norm().scalarMul(2);
        if (deltaMag < minAcceptableDistance) {
          // Separate the two use cases
          useCase1.applyForceOnSelf(velocity.neg());
          useCase2.applyForceOnSelf(velocity);
        } else if (deltaMag > maxAcceptableDistance) {
          // Bring the two together
          useCase1.applyForceOnSelf(velocity);
          useCase2.applyForceOnSelf(velocity.neg());
        }
      }
    }
  }
  for (const useCase of useCases) {
    useCase.finalizeForceApplied();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const useCase of useCases) {
    useCase.draw();
  }
}

init();
setInterval(() => {
  update();
  draw();
}, 1000 / 60);
