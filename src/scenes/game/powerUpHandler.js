const POWER_UP_DURATION_MS = 8000;
export const RAPID_FIRE_INTERVAL_MS = 100;

export class PowerUpHandler {
  #spreadActive = false;
  #rapidActive = false;
  #bombReady = false;
  #spreadTimeout = null;
  #rapidTimeout = null;

  activateSpreadShot(onRestart) {
    this.#spreadActive = true;
    clearTimeout(this.#spreadTimeout);
    this.#spreadTimeout = setTimeout(() => {
      this.#spreadActive = false;
      onRestart();
    }, POWER_UP_DURATION_MS);
  }

  activateRapidFire(onRestart) {
    this.#rapidActive = true;
    clearTimeout(this.#rapidTimeout);
    this.#rapidTimeout = setTimeout(() => {
      this.#rapidActive = false;
      onRestart();
    }, POWER_UP_DURATION_MS);
  }

  activateBomb() {
    this.#bombReady = true;
  }

  consumeBomb() {
    this.#bombReady = false;
  }

  isSpreadShotActive() { return this.#spreadActive; }
  isRapidFireActive()  { return this.#rapidActive; }
  isBombReady()        { return this.#bombReady; }

  reset() {
    clearTimeout(this.#spreadTimeout);
    clearTimeout(this.#rapidTimeout);
    this.#spreadActive = false;
    this.#rapidActive = false;
    this.#bombReady = false;
    this.#spreadTimeout = null;
    this.#rapidTimeout = null;
  }
}
