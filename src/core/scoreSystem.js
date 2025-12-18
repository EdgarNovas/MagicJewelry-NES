import { SCORE } from "./constants.js";

const state = {
  score: 0,
  jewelryPoints: 0,
  jewelryLevel: 0,
  hiScore: 0,
  scoreToAdd: 0,
  scorehasChanged: false
};

export function loadHighScore() {
  const value = localStorage.getItem(SCORE.KEY);
  state.hiScore = value ? parseInt(value, 10) : 0;
}

export function saveHighScore(score) {
  const current = getHiScore();
  if (score > current) {
    localStorage.setItem(SCORE.KEY, score.toString());
    return score;
  }
  return current;
}

export function resetHighScore(){
  localStorage.removeItem(KEY);
}

export function initScoreSystem(){
  state.score = 0;
  state.jewelryPoints = 0;
  state.jewelryLevel = 0;
  loadHighScore();
}

export function addScore(points){
  state.score += points;
}

export function addJweleryPoints(){
  state.jewelryPoints++;
}

export function getScore() {
  return state.score;
}

export function setScore(newScore) {
  state.score += newScore;
}

export function getScoreToAdd() {
  return state.scoreToAdd;
}

export function setScoreToAdd(newScoreToAdd) {
  state.scorehasChanged = true;
  state.scoreToAdd = newScoreToAdd;
}

export function getScoreHasChanged(){
  return state.scorehasChanged;
}

export function setScoreHasChangedFasle(){
  state.scorehasChanged = false;
}

export function getJewelryPoints() {
  return state.jewelryPoints;
}

export function setJewelryPoints(points) {
  state.jewelryPoints += points;
}

export function setJewelryLevel(level) {
  state.jewelryLevel = level;
}

export function getJewelryLevel() {
  return state.jewelryLevel;
}

export function getHiScore() {
  return state.hiScore;
}

export function setHiScore(highestScore) {
  state.hiScore += highestScore;
}