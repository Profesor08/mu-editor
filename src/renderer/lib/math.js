export class Matrix extends Array {
  constructor(x, y) {
    super(x);

    for (let i = 0; i < x; i++) {
      this[i] = new Array(y);

      for (let j = 0; j < y; j++) {
        this[i][j] = 0;
      }
    }
  }
}

export function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

export function map(n, start1, stop1, start2, stop2, withinBounds) {
  var newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}

export function numberToBytesArray(number) {
  const bytesArray = [];

  while (number > 0) {
    const byte = number & 0xff;

    bytesArray.unshift(byte);

    number = (number - byte) / 256;
  }

  return bytesArray;
}

export function numberToBytesArray32(number) {
  const bytesArray = numberToBytesArray(number);

  return fillBytesArray(bytesArray, 4);
}

export function fillBytesArray(bytesArray, size) {
  const newBytesArray = [...bytesArray];

  for (let i = newBytesArray.length; i < size; i++) {
    newBytesArray.unshift(0);
  }

  return newBytesArray;
}

export function bytesArrayToNumber(bytesArray) {
  return bytesArray.reduce((accumulator, value) => accumulator * 256 + value);
}
