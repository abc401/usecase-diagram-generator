import { init } from "./canvas";
init();

import { ctx } from "./canvas";
import { UseCase } from "./usecase";

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

/**
 * @param {string} useCaseName
 * @param {number} x
 * @param {number} y
 */
function drawUseCase(useCaseName, x, y) {
  const padding = 20;
  const measurement = ctx.measureText(useCaseName);
  const height =
    Math.abs(measurement.actualBoundingBoxAscent) +
    Math.abs(measurement.actualBoundingBoxDescent);
  const width = measurement.width;
  const radius = Math.max(width, height) + padding;

  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillText(useCaseName, x - width / 2, y + height / 2);

  return { size: radius };
}

function drawUseCases() {
  let x = 0;
  for (let usecase of useCases) {
    const measurement = drawUseCase(usecase, x, 100);
    x += measurement.size * 2;
  }
}

drawUseCases();
