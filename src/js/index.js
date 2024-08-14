import { canvas, ctx, init } from "./canvas.js";
init();

import { makeSpace, makeSpaceSingle } from "./spacing.js";
import { UseCase } from "./usecase.js";

const USER = "user";
const ADMIN = "admin";
const DB = "db";

const LOGIN = new UseCase("login");
const SIGNUP = new UseCase("signup");
const ABC = new UseCase("abcghijkl");
const DEF = new UseCase("defghklmnopqr");

const useCases = [LOGIN, SIGNUP, ABC, DEF];
const actors = [USER, ADMIN, DB];
const actorToUseCase = new Map([
  [USER, LOGIN],
  [USER, SIGNUP],
  [ADMIN, SIGNUP],
  [DB, ABC],
  [DB, DEF],
]);

function drawUseCases() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let x = 0;
  for (const useCase of useCases) {
    useCase.draw();
    const measurement = useCase.dimensions;
    x += measurement.radius * 2;
  }
}

makeSpace(useCases);

setInterval(() => {
  drawUseCases();
}, 1000 / 60);
