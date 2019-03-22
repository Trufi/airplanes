export const mainServer = {
  url: 'https://sky.2gis.ru',
  // url: 'http://localhost:3002',

  /**
   * Если игровой сервер не прислал информацию о себе за это время, то удаляем его
   */
  clearGameThreshold: 30000,
};

export const gameServer = {
  updateMainInverval: 10000,
};

export const weapon = {
  damage: 8,

  /**
   * Меньший радиус усеченного конуса
   */
  radius: 100,

  /**
   * Угл попадания в градусах
   */
  hitAngle: 2,
  cooldown: 200,
  animationDuration: 5,
  animationCooldown: 25,
  distance: 300000,

  offset: 5000,
  bullet: {
    color: {
      flash: 0xd1780c,
      line: 0xd8c70d,
    },
    opacity: 0.8,
    width: 2,
    offset: { x: 920, y: 1550, z: 470 },
  },

  /**
   * Скорость охлаждения в секунду
   */
  restoringSpeed: 20,
  /**
   * Перегрев за 1 выстрел
   */
  heatPerFire: 5,

  /**
   * Максимальный перегрев
   */
  maxHeat: 100,
};

export const boost = {
  /**
   * Скорость восстановления ускорения в секунду
   */
  restoringSpeed: 0.25,
  /**
   * Скорость траты ускорения в секунду
   */
  spendingSpeed: 1,

  /**
   * Множитель, на который умножается обычная скорость самолета при ускорении
   */
  factor: 2.5,

  maxVolume: 4,
};

export const airplane = {
  maxHealth: 100,
  scale: 4000,
  velocity: 30,
  initRotation: { x: -Math.PI / 2, y: 0, z: Math.PI },
  propeller: { x: 0, y: 0.03, z: 0.666, radius: 0.26, opacity: 0.4 },

  /**
   * Коэффициент поворота по оси Y в зависимости от угловой скорости
   */
  yRotationFactor: 1500,
};

export const camera = {
  pitch: 90,
};

export const origin = [82.920412, 55.030111];

export const resurrection = {
  radius: 500000,
  height: 50000,
};

export const deathNote = {
  delay: 5000,
};

export const serverGameStep = 100;
export const clientSendChangesInterval = 100;
export const clientPingInterval = 500;
export const smoothPingTime = 2000;
export const minimalHeight = 10000;

export const compression = {
  position: 0.1,
  rotation: 100,
};

export const points = {
  kills: 250,
  deaths: -100,
};

export const damageIndicator = {
  delay: 300,
};
