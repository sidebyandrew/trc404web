import { v4 as uuidv4 } from 'uuid';


export function uuid404(): string {
  return uuidv4().replace(/-/g, '');
}

export function generateRefCode(username: string): string {
  const uppercaseUsername = username.toUpperCase();
  let refCode = '';

  for (let i = 0; i < uppercaseUsername.length; i++) {
    const char = uppercaseUsername[i];
    let newChar = char;
    if (char >= 'A' && char <= 'Z') {
      const newCharCode = ((char.charCodeAt(0) - 65 + 2) % 26) + 65;
      newChar = String.fromCharCode(newCharCode);
    }

    refCode += newChar;
  }

  return 'T404_' + refCode;
}


export function addressTrim(str: string | undefined): string {
  if (!str) {
    return '';
  }
  if (str.length <= 8) {
    return str;
  } else {
    const start = str.substring(0, 4);
    const end = str.substring(str.length - 4);
    return `${start}...${end}`;
  }
}


export function calculateTotal(amount: any, unit: any): string {
  if (!amount || !unit) {
    return '';
  }

  if (typeof amount == 'number' && typeof unit == 'number') {
    const result = amount * unit;
    return decimalFriendly(result);
  } else {
    return '';
  }
}


export function decimalFriendly(num: any): string {
  if (!num) {
    return '';
  }
  try {
    const decimalPlaces = num.toString().split('.')[1]?.length || 0;
    if (decimalPlaces === 0) {
      return num.toString();
    } else if (decimalPlaces === 1 || decimalPlaces === 2 || decimalPlaces === 3) {
      return num.toString();
    } else {
      return num.toString();
    }
  } catch (e) {
    console.error('decimalFriendly error:', num);
    return '';
  }
}

