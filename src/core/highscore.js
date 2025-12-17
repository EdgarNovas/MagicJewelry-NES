const KEY = 'magicjewelry_hiscore';

export function getHighScore() {
  const value = localStorage.getItem(KEY);
  return value ? parseInt(value, 10) : 0;
}

export function setHighScore(score) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem(KEY, score.toString());
    return score;
  }
  return current;
}